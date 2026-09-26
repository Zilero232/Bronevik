import { NATIONS } from '@otmetki/gamedata';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';

import type { CollectedArmorModels } from '../src/modules/gamedata';

import { ARMOR_VIEWER } from '../src/config';
import { createPrismaClient } from '../src/core/prisma/prisma.factory';
import {
  ArmorVersionMismatchError,
  buildGameData,
  collectArmorModels,
  createArmorStorage,
  createGithubReader,
  createImportPlan,
  createLocalReader,
  createLocalRepoReader,
  createRepoReader,
  GAME_DATA_SOURCES,
  isNation,
  MODEL_SOURCES,
  writeArmorModels,
  writeImportPlan
} from '../src/modules/gamedata';

const { values } = parseArgs({
  options: {
    source: { type: 'string', default: 'RU' },
    ref: { type: 'string' },
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
    'armor-dir': { type: 'string' }
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
const plan = createImportPlan({ data });

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

const storageEnv = z
  .object({
    REPLAY_STORAGE: z.enum(['local', 's3']).default('local'),
    S3_ENDPOINT: z.string().default(''),
    S3_REGION: z.string().default('us-east-1'),
    S3_BUCKET: z.string().default(''),
    S3_ACCESS_KEY_ID: z.string().default(''),
    S3_SECRET_ACCESS_KEY: z.string().default('')
  })
  .parse(process.env);

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
  }

  if (armor) {
    const storage = createArmorStorage({
      ...storageEnv,
      ARMOR_STORAGE_DIR: values['armor-dir'] ?? resolve(fileURLToPath(new URL('../../..', import.meta.url)), ARMOR_VIEWER.storageDir)
    });

    console.table(await writeArmorModels({ prisma, storage, collected: armor, onProgress: (message) => console.log(`  ${message}`) }));
  }
} finally {
  await prisma.$disconnect();
}
