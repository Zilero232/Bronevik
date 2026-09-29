import type { GuideStatus } from '@/entities/guide/guide';
import type { BadgeTone } from '@/ui-kit';

export const GUIDE_STATUS_TONE = {
  draft: 'neutral',
  pending: 'warning',
  published: 'success',
  rejected: 'danger',
  hidden: 'steel'
} as const satisfies Record<GuideStatus, BadgeTone>;
