import type { WebhookEvent } from '@bronevik/schemas';

import { WEBHOOK } from '@bronevik/schemas';

export const WEBHOOK_EVENT_KEYS = {
  'mark.gained': 'markGained',
  'session.ended': 'sessionEnded',
  'clan.member_changed': 'clanMemberChanged'
} as const satisfies Record<WebhookEvent, string>;

export const WEBHOOK_DOCS = {
  headers: [
    { name: WEBHOOK.signatureHeader, key: 'signature' },
    { name: WEBHOOK.timestampHeader, key: 'timestamp' },
    { name: WEBHOOK.eventHeader, key: 'event' },
    { name: WEBHOOK.deliveryHeader, key: 'delivery' }
  ],
  retries: 6,
  disableAfter: 20,
  toleranceMinutes: 5
} as const;
