import { describe, expect, it } from 'vitest';

import { attendedAccounts } from '../attendance';

const startsAt = new Date('2026-09-20T18:00:00Z');
const endsAt = new Date('2026-09-20T20:00:00Z');
const at = (iso: string) => new Date(iso);

describe('attendedAccounts', () => {
  it('marks a member present when battles grew across the event', () => {
    const result = attendedAccounts({
      samples: [
        { accountId: 1n, capturedAt: at('2026-09-20T12:00:00Z'), battles: 100 },
        { accountId: 1n, capturedAt: at('2026-09-20T22:00:00Z'), battles: 104 },
        { accountId: 2n, capturedAt: at('2026-09-20T12:00:00Z'), battles: 50 },
        { accountId: 2n, capturedAt: at('2026-09-21T09:00:00Z'), battles: 50 }
      ],
      startsAt,
      endsAt
    });

    expect(result.get(1n)).toBe(true);
    expect(result.get(2n)).toBe(false);
  });

  it('uses the closest snapshots on each side', () => {
    const result = attendedAccounts({
      samples: [
        { accountId: 1n, capturedAt: at('2026-09-19T12:00:00Z'), battles: 90 },
        { accountId: 1n, capturedAt: at('2026-09-20T17:59:00Z'), battles: 100 },
        { accountId: 1n, capturedAt: at('2026-09-20T20:00:00Z'), battles: 100 },
        { accountId: 1n, capturedAt: at('2026-09-22T12:00:00Z'), battles: 120 }
      ],
      startsAt,
      endsAt
    });

    expect(result.get(1n)).toBe(false);
  });

  it('says nothing about a member without snapshots on both sides', () => {
    const result = attendedAccounts({ samples: [{ accountId: 3n, capturedAt: at('2026-09-20T22:00:00Z'), battles: 5 }], startsAt, endsAt });

    expect(result.has(3n)).toBe(false);
  });
});
