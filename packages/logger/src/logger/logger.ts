import type { Logger } from 'pino';

import pino from 'pino';

import type { CreateLoggerInput } from './logger.types';

import { REDACTION } from './logger.constants';
import { resolveLevel, resolveTransport } from './logger.transport';

export const createLogger = ({ service, pretty, level }: CreateLoggerInput): Logger =>
  pino({
    level: resolveLevel(level),
    base: { service },
    redact: { paths: [...REDACTION.paths], censor: REDACTION.censor },
    ...resolveTransport(pretty)
  });
