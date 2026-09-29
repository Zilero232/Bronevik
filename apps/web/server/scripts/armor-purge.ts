import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';

import { ARMOR_VIEWER } from '../src/config';
import { createPrismaClient } from '../src/core/prisma';
import { createArmorStorage, purgeArmorModels } from '../src/modules/gamedata';

const { values } = parseArgs({
  options: {
    yes: { type: 'boolean', default: false },
    'armor-dir': { type: 'string' }
  }
});

if (!values.yes) {
  console.error('This deletes every stored armor model and its database row. Re-run with --yes.');
  process.exit(1);
}

const env = z.object({ DATABASE_URL: z.url() }).parse(process.env);

const storageDir = values['armor-dir'] ?? resolve(fileURLToPath(new URL('../../../..', import.meta.url)), ARMOR_VIEWER.storageDir);
const prisma = createPrismaClient({ url: env.DATABASE_URL });

try {
  const removed = await purgeArmorModels({ prisma, storage: createArmorStorage(storageDir) });

  await rm(storageDir, { recursive: true, force: true });

  console.log(`✓ purged ${removed} armor models`);
} finally {
  await prisma.$disconnect();
}
