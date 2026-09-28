import { tz } from '@date-fns/tz';
import { addMonths, format, startOfMonth } from 'date-fns';

import type { UsagePeriod } from './usage-period.types';

import { TIME } from '../../../../config';

const moscow = tz(TIME.zone);

export const usagePeriod = (now: Date): UsagePeriod => ({
  key: format(now, 'yyyy-MM', { in: moscow }),
  resetsAt: new Date(startOfMonth(addMonths(now, 1, { in: moscow }), { in: moscow }).getTime())
});
