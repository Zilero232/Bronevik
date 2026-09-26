import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { allowedOrigins, corsOptionsFor, isProduction, validateEnv } from './config';
import { PublicApiModule } from './modules/public-api';
import { setupDocs } from './openapi';

import 'reflect-metadata';

const env = validateEnv(process.env);

const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false, bufferLogs: true });

app.useLogger(app.get(Logger));

app.set('trust proxy', 1);
app.set('json replacer', (_key: string, value: unknown) => (typeof value === 'bigint' ? Number(value) : value));

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'same-site' } }));

const origins = allowedOrigins(env);

app.enableCors((request: { url?: string }, callback) => callback(null, corsOptionsFor({ url: request.url ?? '', origins })));

setupDocs({ app, internal: !isProduction(env), include: [PublicApiModule] });

app.enableShutdownHooks();

await app.listen(env.PORT);
