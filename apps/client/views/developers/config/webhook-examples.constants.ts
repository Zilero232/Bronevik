import type { WebhookEvent, WebhookPayload } from '@bronevik/schemas';

export const WEBHOOK_EXAMPLES = {
  'mark.gained': {
    id: '6f1c2a4e-8d3b-4c7a-9e21-3b5f0d8a7c10',
    event: 'mark.gained',
    createdAt: '2026-09-24T19:42:07.000Z',
    data: { accountId: 12345678, nickname: 'Tanker', tankId: 7249, marks: 3, previousMarks: 2, percent: 95.12, source: 'mod' }
  },
  'session.ended': {
    id: '0b9d7e52-1a6f-4f3c-8b44-5e2c9a1d6f83',
    event: 'session.ended',
    createdAt: '2026-09-24T22:10:31.000Z',
    data: {
      sessionId: 'c2f7a9d1-4b3e-4e8a-9f60-7d1b2c3e4f50',
      accountId: 12345678,
      nickname: 'Tanker',
      source: 'mod',
      startedAt: '2026-09-24T19:05:12.000Z',
      endedAt: '2026-09-24T21:58:44.000Z',
      battles: 24,
      wins: 15,
      winRate: 62.5,
      avgDamage: 3412,
      wn8: 2687
    }
  },
  'clan.member_changed': {
    id: 'a4e8c1f2-7b9d-4d2e-8c5a-1f3b6e9d0c27',
    event: 'clan.member_changed',
    createdAt: '2026-09-25T06:00:03.000Z',
    data: {
      clanId: 500012345,
      tag: 'BRNV',
      changes: [
        { accountId: 12345678, type: 'joined', oldRole: null, newRole: 'private', occurredAt: '2026-09-25T05:41:00.000Z' },
        { accountId: 87654321, type: 'role_changed', oldRole: 'private', newRole: 'recruiter', occurredAt: '2026-09-25T05:47:00.000Z' }
      ]
    }
  }
} as const satisfies Record<WebhookEvent, WebhookPayload>;
