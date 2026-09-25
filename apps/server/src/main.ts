import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { allowedOrigins, isProduction, validateEnv } from './config';
import { AppLogger, LOGGER } from './core';
import { CORS } from './main.constants';
import { setupDocs } from './openapi';

import 'reflect-metadata';

const env = validateEnv(process.env);

const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false, logger: new AppLogger(LOGGER.service.server) });

app.set('trust proxy', 1);
app.set('json replacer', (_key: string, value: unknown) => (typeof value === 'bigint' ? Number(value) : value));

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'same-site' } }));

app.enableCors({
  origin: allowedOrigins(env),
  credentials: true,
  methods: [...CORS.methods],
  exposedHeaders: [...CORS.exposedHeaders]
});

setupDocs({ app, internal: !isProduction(env) });

app.enableShutdownHooks();

await app.listen(env.PORT);
