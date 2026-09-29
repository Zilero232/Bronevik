import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';

import { validateEnv } from './config';
import { WORKER } from './worker.constants';
import { WorkerModule } from './worker.module';

import 'reflect-metadata';

const env = validateEnv(process.env);

const app = await NestFactory.createApplicationContext(WorkerModule, { bufferLogs: true });

app.useLogger(app.get(PinoLogger));

if (env.LESTA_APPLICATION_ID === '') {
  new Logger(WORKER.logContext).warn(WORKER.degradedWarning);
}

app.enableShutdownHooks();

await app.init();
