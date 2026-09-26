import { WATCHLIST } from '@otmetki/schemas';
import { addHours } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { digestWindowStart, isDigestDue, summarizeDigest } from '../watchlist-digest';

const NOW = new Date('2026-09-26T12:05:00Z');

describe('isDigestDue', () => {
  it('never sends when the digest is off', () => {
    expect(isDigestDue({ digest: 'off', lastDigestAt: null, now: NOW })).toBe(false);
  });

  it('sends the first digest right away', () => {
    expect(isDigestDue({ digest: 'weekly', lastDigestAt: null, now: NOW })).toBe(true);
  });

  it('waits for the interval and tolerates a scheduler running a few minutes early', () => {
    const hours = WATCHLIST.digestHours.daily;

    expect(isDigestDue({ digest: 'daily', lastDigestAt: addHours(NOW, -hours + 1), now: NOW })).toBe(false);
    expect(isDigestDue({ digest: 'daily', lastDigestAt: new Date(addHours(NOW, -hours).getTime() + 5 * 60_000), now: NOW })).toBe(true);
  });
});

describe('digestWindowStart', () => {
  it('starts at the previous digest, or one interval back for the first one', () => {
    const last = new Date('2026-09-25T12:00:00Z');

    expect(digestWindowStart({ digest: 'daily', lastDigestAt: last, now: NOW })).toEqual(last);
    expect(digestWindowStart({ digest: 'hourly', lastDigestAt: null, now: NOW })).toEqual(addHours(NOW, -WATCHLIST.digestHours.hourly));
  });
});

describe('summarizeDigest', () => {
  it('has nothing to send when nobody played', () => {
    expect(summarizeDigest({ players: [{ nickname: 'a', battles: 0, wins: 0, marksGained: 0 }], limit: 3 })).toBeNull();
  });

  it('puts players with new marks first and caps the list', () => {
    const summary = summarizeDigest({
      players: [
        { nickname: 'grinder', battles: 40, wins: 20, marksGained: 0 },
        { nickname: 'marker', battles: 5, wins: 3, marksGained: 1 },
        { nickname: 'idle', battles: 0, wins: 0, marksGained: 0 }
      ],
      limit: 1
    });

    expect(summary?.activePlayers).toBe(2);
    expect(summary?.battles).toBe(45);
    expect(summary?.top.map((player) => player.nickname)).toEqual(['marker']);
  });
});
