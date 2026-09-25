import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { validateEnv } from './config';
import { AppLogger, LOGGER } from './core';
import { WORKER } from './worker.constants';
import { WorkerModule } from './worker.module';

import 'reflect-metadata';

const env = validateEnv(process.env);

const app = await NestFactory.createApplicationContext(WorkerModule, { logger: new AppLogger(LOGGER.service.worker) });

if (env.LESTA_APPLICATION_ID === '') {
  new Logger(WORKER.logContext).warn(WORKER.degradedWarning);
}

app.enableShutdownHooks();

await app.init();
