import { serverPeriodSchema } from '@bronevik/schemas';
import { parseAsStringLiteral } from 'nuqs';

import { TOP_METRICS } from './tank-page.constants';

export const TANK_URL_PARSERS = {
  period: parseAsStringLiteral(serverPeriodSchema.options).withDefault('30d'),
  metric: parseAsStringLiteral(TOP_METRICS).withDefault('wn8')
} as const;
