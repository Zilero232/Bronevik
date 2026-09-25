import { NestFactory } from '@nestjs/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { AppModule } from '../src/app.module';
import { publicDocument } from '../src/openapi';

import 'reflect-metadata';

const { values } = parseArgs({
  options: {
    out: { type: 'string', default: fileURLToPath(new URL('../../../packages/sdk/openapi/v1.json', import.meta.url)) }
  }
});

const app = await NestFactory.create(AppModule, { logger: ['error'], abortOnError: false });
const document = publicDocument(app);
const out = resolve(values.out);

await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(document, null, 2)}\n`);
await app.close();

console.log(`OpenAPI for /v1 → ${out} (${Object.keys(document.paths).length} paths)`);

process.exit(0);
