import type { DynamicModule } from '@nestjs/common';

import { createLogger } from '@bronevik/logger';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { LOGGER } from './logger.constants';
import { isQuietRequest, requestId, serializeRequest, serializeResponse } from './logger.serializers';

@Module({})
export class AppLoggerModule {
  static forService(service: string): DynamicModule {
    return LoggerModule.forRoot({
      pinoHttp: {
        logger: createLogger({ service, pretty: LOGGER.pretty }),
        genReqId: (request, response) => requestId({ request, response }),
        autoLogging: { ignore: isQuietRequest },
        serializers: { req: serializeRequest, res: serializeResponse }
      }
    });
  }
}
