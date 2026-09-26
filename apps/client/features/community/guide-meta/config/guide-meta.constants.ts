import { hoursToMilliseconds } from 'date-fns';

import type { GuideStatus } from '@/shared/api/guides';
import type { BadgeTone } from '@/ui-kit';

export const GUIDE_STATUS_TONE = {
  draft: 'neutral',
  pending: 'warning',
  published: 'success',
  rejected: 'danger',
  hidden: 'steel'
} as const satisfies Record<GuideStatus, BadgeTone>;

export const GUIDE_SUBJECT = {
  catalogStaleMs: hoursToMilliseconds(1),
  mapsStaleMs: hoursToMilliseconds(1)
} as const;
