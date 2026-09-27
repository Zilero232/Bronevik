import type { WebhookEvent } from '@otmetki/schemas';

import type { NotificationEvent } from '../../../../generated';

export const WEBHOOK_DB_EVENTS = [
  'moeGained',
  'sessionFinished',
  'clanRosterChanged',
  'moeThresholdDropped'
] as const satisfies readonly NotificationEvent[];

export const WEBHOOK_EVENT_TO_DB = {
  'mark.gained': 'moeGained',
  'session.ended': 'sessionFinished',
  'clan.member_changed': 'clanRosterChanged'
} as const satisfies Record<WebhookEvent, (typeof WEBHOOK_DB_EVENTS)[number]>;

export const WEBHOOK_EVENT_FROM_DB = {
  moeGained: 'mark.gained',
  sessionFinished: 'session.ended',
  clanRosterChanged: 'clan.member_changed',
  moeThresholdDropped: null
} as const satisfies Record<(typeof WEBHOOK_DB_EVENTS)[number], WebhookEvent | null>;
