import { NATIONS } from '@bronevik/gamedata';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';

import { createPrismaClient } from '../src/core/prisma/prisma.factory';
import {
  buildGameData,
  createGithubReader,
  createImportPlan,
  createLocalReader,
  GAME_DATA_SOURCES,
  isNation,
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
    'no-current': { type: 'boolean', default: false }
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
  const counts = await writeImportPlan({
    prisma,
    plan,
    mode,
    markCurrent: mode === 'full' && !values['no-current'],
    onProgress: (message) => console.log(`  ${message}`)
  });

  console.log(`✓ ${mode} import of ${plan.title} finished in ${Math.round(performance.now() - started)} ms`);
  console.table(counts);
} finally {
  await prisma.$disconnect();
}
