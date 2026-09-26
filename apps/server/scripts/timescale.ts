import { config } from 'dotenv';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

import { TIMESCALE } from '../src/config/timescale.constants';
import { buildTimescaleStatements } from '../src/core/prisma/timescale';

config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)), quiet: true });

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  console.error('DIRECT_URL is not set (root .env).');
  process.exit(1);
}

const sqlDir = fileURLToPath(new URL('../prisma/sql/timescale/', import.meta.url));
const files = await Promise.all((await readdir(sqlDir)).map(async (name) => ({ name, sql: await readFile(`${sqlDir}${name}`, 'utf8') })));
const statements = buildTimescaleStatements({
  files,
  config: TIMESCALE,
  refresh: process.argv.includes('--refresh'),
  extensionsOnly: process.argv.includes('--extensions')
});

const client = new Client({ connectionString: url });

console.log('→ config', TIMESCALE);

await client.connect();

try {
  for (const { label, sql } of statements) {
    console.log(`→ ${label}`);
    await client.query(sql);
  }

  console.log('TimescaleDB layer applied.');
} finally {
  await client.end();
}
