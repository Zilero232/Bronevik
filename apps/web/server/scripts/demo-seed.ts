import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateEnv } from '../src/config';
import { createPrismaClient } from '../src/core/prisma';

// First boot of a keyless demo (docker-compose.demo.yml, service `demo-seed`):
// fills an empty database with the game catalog and the generated world, then
// exits. Each step runs only while its tables are empty, so the service can run
// on every `docker compose up` and costs two counts once the data is there.
// Arguments after the script name go to dev-seed (e.g. `--accounts 300 --days 30`).

const env = validateEnv(process.env);

if (!env.DEMO_MODE) {
  console.error('demo-seed fills a public demo with generated data and runs only with DEMO_MODE=true.');
  process.exit(1);
}

const log = (message: string) => console.log(`[demo-seed] ${message}`);
const scripts = fileURLToPath(new URL('.', import.meta.url));

// Importing the config module has @nestjs/config copy the resolved env into
// process.env for every variable that is absent, the mock's application id
// included. validateEnv has refused a real key by now, so the children get the
// key present and empty: they import the config module too, and gamedata-import
// would otherwise send the mock's id to the real Lesta API.
const childEnv = { ...process.env, LESTA_APPLICATION_ID: '' };

const run = async (script: string, args: string[]) => {
  log(`running ${script} ${args.join(' ')}`.trim());

  const child = Bun.spawn(['bun', join(scripts, script), ...args], { stdio: ['ignore', 'inherit', 'inherit'], env: childEnv });
  const code = await child.exited;

  if (code !== 0) {
    console.error(`[demo-seed] ${script} exited with ${code}`);
    process.exit(code);
  }
};

const prisma = createPrismaClient({ url: env.DATABASE_URL, pool: { max: 1 } });
const [vehicles, players] = await Promise.all([prisma.vehicle.count(), prisma.player.count()]).finally(() => prisma.$disconnect());

// The image's app directory belongs to root; the unprivileged user caches the
// GitHub downloads in the temp dir instead.
if (vehicles === 0) {
  await run('gamedata-import.ts', ['--cache', join(tmpdir(), 'otmetki-gamedata')]);
} else {
  log(`game catalog present (${vehicles} vehicles), skipping the import`);
}

if (players === 0) {
  await run('dev-seed.ts', process.argv.slice(2));
} else {
  log(`generated world present (${players} players), skipping the seed`);
}

log('done');
