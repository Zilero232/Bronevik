import type { INestApplication } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { AppModule } from '../src/app.module';
import { PublicApiModule } from '../src/modules/public-api';
import { internalDocument, publicDocument } from '../src/openapi';

import 'reflect-metadata';

const DOCUMENTS = {
  public: { build: (app: INestApplication) => publicDocument({ app, include: [PublicApiModule] }), out: '../../../packages/sdk/openapi/v1.json' },
  internal: { build: internalDocument, out: '../../client/shared/api/openapi/internal.json' }
} as const;

const { values } = parseArgs({
  options: {
    doc: { type: 'string', default: 'public' },
    out: { type: 'string' }
  }
});

const kind = values.doc === 'internal' ? 'internal' : 'public';
const target = DOCUMENTS[kind];
const app = await NestFactory.create(AppModule, { logger: ['error'], abortOnError: false });
const document = target.build(app);
const out = resolve(values.out ?? fileURLToPath(new URL(target.out, import.meta.url)));

await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(document, null, 2)}\n`);
await app.close();

console.log(`OpenAPI (${kind}) → ${out} (${Object.keys(document.paths).length} paths)`);

process.exit(0);
