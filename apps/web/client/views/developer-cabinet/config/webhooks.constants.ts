import type { BadgeTone } from '@/ui-kit';

import { QUERY_KEYS } from '@/shared/constants';

export const WEBHOOK_EVENT_KEYS = {
  'mark.gained': 'markGained',
  'session.ended': 'sessionEnded',
  'clan.member_changed': 'clanMemberChanged'
} as const;

export const WEBHOOK_STATUS_TONE = {
  active: 'success',
  paused: 'neutral',
  disabled: 'danger'
} as const satisfies Record<string, BadgeTone>;

export const DELIVERY_STATUS_TONE = {
  pending: 'warning',
  succeeded: 'success',
  failed: 'danger'
} as const satisfies Record<string, BadgeTone>;

export const WEBHOOK_QUERIES = {
  invalidates: [QUERY_KEYS.me.developer.overview, QUERY_KEYS.me.developer.webhooks]
} as const;
