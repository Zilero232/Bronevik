import { NATIONS } from '@otmetki/gamedata';
import { Redis } from 'ioredis';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';

import type { CollectedArmorModels } from '../src/modules/gamedata';

import { ARMOR_VIEWER, envSchema, LESTA } from '../src/config';
import { createLestaClients } from '../src/core/lesta';
import { createPrismaClient } from '../src/core/prisma';
import {
  ArmorVersionMismatchError,
  buildGameData,
  buildPersonalMissions,
  collectArmorModels,
  compareEncyclopediaVersion,
  createArmorStorage,
  createGithubReader,
  createImportPlan,
  createLocalReader,
  createLocalRepoReader,
  createRepoReader,
  GAME_DATA_SOURCES,
  importLocalizationKeys,
  isNation,
  loadLocalization,
  LOCALE_SOURCES,
  MODEL_SOURCES,
  MT_CLIENT,
  writeArmorModels,
  writeImportPlan,
  writePersonalMissions
} from '../src/modules/gamedata';

const { values } = parseArgs({
  options: {
    source: { type: 'string', default: 'RU' },
    ref: { type: 'string' },
    'locale-ref': { type: 'string' },
    local: { type: 'string' },
    cache: { type: 'string' },
    nations: { type: 'string' },
    limit: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    snapshot: { type: 'boolean', default: false },
    'no-current': { type: 'boolean', default: false },
    armor: { type: 'boolean', default: false },
    'armor-only': { type: 'boolean', default: false },
    'models-ref': { type: 'string' },
    'local-models': { type: 'string' },
    'armor-dir': { type: 'string' },
    'skip-missions': { type: 'boolean', default: false },
    'strict-armor': { type: 'boolean', default: false },
    'allow-version-mismatch': { type: 'boolean', default: false }
  }
});

const options = z
  .object({
    source: z.enum(['RU', 'PT_RU', 'IZEBERG_RU']),
    limit: z.coerce.number().int().positive().optional()
  })
  .parse({ source: values.source, limit: values.limit });

const nations = values.nations ? values.nations.split(',').filter(isNation) : NATIONS;
const source = GAME_DATA_SOURCES[options.source];
const cacheDir = values.cache ?? fileURLToPath(new URL('../.cache', import.meta.url));
const started = performance.now();

const reader = values.local
  ? createLocalReader({ sourceId: options.source, root: values.local })
  : await createGithubReader({ sourceId: options.source, ref: values.ref, cacheDir, token: process.env.GITHUB_TOKEN });

console.log(`→ ${reader.revision.owner}/${reader.revision.repo}@${reader.revision.ref} (${reader.revision.sha})`);

const data = await buildGameData({ reader, nations, vehicleLimit: options.limit, onProgress: (message) => console.log(`  ${message}`) });

const checkEncyclopediaVersion = async (): Promise<void> => {
  const applicationId = process.env.LESTA_APPLICATION_ID;

  if (!applicationId || source.isTest || !data.version) {
    console.warn(`  ! ${MT_CLIENT.product} encyclopedia version not checked (${applicationId ? 'test-server source' : 'no LESTA_APPLICATION_ID'})`);

    return;
  }

  const { REDIS_URL, LESTA_RPS } = envSchema.pick({ REDIS_URL: true, LESTA_RPS: true }).parse(process.env);
  const redis = new Redis(REDIS_URL);
  const lesta = createLestaClients({ applicationId, redis, budget: { requestsPerSecond: LESTA_RPS, reserve: LESTA.tierAReserve } });
  const info = await lesta.priority.encyclopedia.info().finally(() => redis.quit());
  const check = compareEncyclopediaVersion({ clientVersion: data.version, encyclopediaVersion: info.game_version });

  if (check.matches) {
    console.log(`→ ${MT_CLIENT.product} encyclopedia is at ${info.game_version}, client data at ${data.version}`);

    return;
  }

  const message = `client data is at ${data.version} but the ${MT_CLIENT.product} encyclopedia is at ${info.game_version}`;

  if (!values['allow-version-mismatch']) {
    console.error(`✗ ${message}; pin --ref to the live build or pass --allow-version-mismatch`);
    process.exit(1);
  }

  console.warn(`  ! ${message} (allowed)`);
};

await checkEncyclopediaVersion();

const localeReader = values['armor-only']
  ? undefined
  : await createRepoReader({ source: LOCALE_SOURCES.RU, ref: values['locale-ref'], cacheDir, token: process.env.GITHUB_TOKEN }).catch(
      (error: unknown) => {
        console.warn(`  ! localization unavailable, names fall back to tags: ${error instanceof Error ? error.message : String(error)}`);

        return undefined;
      }
    );

const messages = localeReader
  ? await loadLocalization({
      reader: localeReader,
      keys: importLocalizationKeys(data)
    })
  : undefined;

const plan = createImportPlan({ data, messages });
const localizedVehicles = plan.vehicles.filter((vehicle) => vehicle.localized.name !== undefined).length;
const localizedProvisions = plan.provisions.filter((provision) => provision.localized.name !== undefined).length;
const localizedArenas = plan.arenas.filter((arena) => arena.localized.name !== undefined).length;

console.log(
  `→ localization: ${localizedVehicles} of ${plan.vehicles.length} vehicle names, ${localizedProvisions} of ${plan.provisions.length} provision names, ` +
    `${localizedArenas} of ${plan.arenas.length} map names ` +
    `from ${localeReader?.revision.repo ?? 'nowhere'}`
);

console.log(
  `→ plan: ${plan.vehicles.length} vehicles, ${plan.profiles.length} profiles, ${plan.modules.length} modules, ` +
    `${plan.provisions.length} provisions, ${plan.crewSkills.length} crew skills, ${plan.arenas.length} arenas, ${plan.entries.length} raw entries`
);

for (const warning of plan.warnings.slice(0, 20)) {
  console.warn(`  ! ${warning}`);
}

if (plan.warnings.length > 20) {
  console.warn(`  ! …and ${plan.warnings.length - 20} more warnings`);
}

const collectArmor = async (): Promise<CollectedArmorModels | undefined> => {
  const modelsReader = values['local-models']
    ? createLocalRepoReader({ source: MODEL_SOURCES.RU, root: values['local-models'] })
    : await createRepoReader({ source: MODEL_SOURCES.RU, ref: values['models-ref'], cacheDir, token: process.env.GITHUB_TOKEN });

  try {
    const collected = await collectArmorModels({ data, reader: modelsReader, onProgress: (message) => console.log(`  ${message}`) });
    const sizes = collected.models.map(({ bytes }) => bytes.byteLength);

    console.log(
      `→ armor: ${collected.models.length} models, ${collected.skipped.length} skipped, ` +
        `${Math.round(sizes.reduce((sum, size) => sum + size, 0) / Math.max(1, sizes.length))} B average, ${Math.max(0, ...sizes)} B largest`
    );

    for (const { tag, reason } of collected.skipped) {
      console.warn(`  ! armor: no ${MT_CLIENT.product} collision model for ${tag}: ${reason}`);
    }

    if (values['strict-armor'] && collected.skipped.length > 0) {
      console.error(`✗ ${collected.skipped.length} vehicles have no collision model in ${modelsReader.revision.owner}/${modelsReader.revision.repo}`);
      process.exit(1);
    }

    for (const mismatch of collected.mismatches.slice(0, 40)) {
      console.warn(`  ! ${mismatch}`);
    }

    if (collected.mismatches.length > 40) {
      console.warn(`  ! …and ${collected.mismatches.length - 40} more armor mismatches`);
    }

    return collected;
  } catch (error) {
    if (error instanceof ArmorVersionMismatchError) {
      console.warn(`  ! armor skipped, previous models kept: ${error.message}`);

      return undefined;
    }

    throw error;
  }
};

const armor = values.armor || values['armor-only'] ? await collectArmor() : undefined;

const missions = values['skip-missions'] || values['armor-only'] ? undefined : await buildPersonalMissions({ reader, localeReader });

if (missions) {
  console.log(
    `→ personal missions: ${missions.campaigns.length} campaigns, ${missions.operations.length} operations, ${missions.missions.length} missions`
  );

  for (const warning of missions.warnings.slice(0, 10)) {
    console.warn(`  ! ${warning}`);
  }
}

if (values['dry-run']) {
  console.log(`✓ dry run finished in ${Math.round(performance.now() - started)} ms`);
  process.exit(0);
}

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is not set (root .env).');
  process.exit(1);
}

const prisma = createPrismaClient({ url });
const mode = values.snapshot || source.isTest ? 'snapshot' : 'full';

try {
  if (!values['armor-only']) {
    const counts = await writeImportPlan({
      prisma,
      plan,
      mode,
      markCurrent: mode === 'full' && !values['no-current'],
      onProgress: (message) => console.log(`  ${message}`)
    });

    console.log(`✓ ${mode} import of ${plan.title} finished in ${Math.round(performance.now() - started)} ms`);
    console.table(counts);

    if (missions && mode === 'full') {
      console.table(await writePersonalMissions({ prisma, gameVersionId: counts.gameVersionId, data: missions }));
    }
  }

  if (armor) {
    const storage = createArmorStorage(values['armor-dir'] ?? resolve(fileURLToPath(new URL('..', import.meta.url)), ARMOR_VIEWER.storageDir));

    console.table(await writeArmorModels({ prisma, storage, collected: armor, onProgress: (message) => console.log(`  ${message}`) }));
  }
} finally {
  await prisma.$disconnect();
}
