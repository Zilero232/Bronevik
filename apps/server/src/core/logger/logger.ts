import type { LoggerService } from '@nestjs/common';

import { createLogger } from '@bronevik/logger';

import type { LogContext } from './logger.types';

import { LOGGER } from './logger.constants';

const contextOf = (context: LogContext) => (context ? { context } : {});

export class AppLogger implements LoggerService {
  private readonly root: ReturnType<typeof createLogger>;

  constructor(service: string) {
    this.root = createLogger({ service, pretty: LOGGER.pretty });
  }

  log(message: unknown, context?: LogContext) {
    this.root.info(contextOf(context), String(message));
  }

  error(message: unknown, stack?: string, context?: LogContext) {
    this.root.error({ ...contextOf(context), ...(stack ? { stack } : {}) }, String(message));
  }

  warn(message: unknown, context?: LogContext) {
    this.root.warn(contextOf(context), String(message));
  }

  debug(message: unknown, context?: LogContext) {
    this.root.debug(contextOf(context), String(message));
  }

  verbose(message: unknown, context?: LogContext) {
    this.root.trace(contextOf(context), String(message));
  }
}
