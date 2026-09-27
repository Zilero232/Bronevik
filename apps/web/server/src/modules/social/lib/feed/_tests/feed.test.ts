import { describe, expect, it } from 'vitest';

import { FEED } from '../../../config';
import { buildFeed, isMarkGain, isMasteryGain } from '../feed';

const at = (iso: string) => new Date(iso);

describe('isMarkGain', () => {
  it('needs a known previous value that is lower', () => {
    expect(isMarkGain({ marks_on_gun: 2, prev_marks: 1 })).toBe(true);
    expect(isMarkGain({ marks_on_gun: 2, prev_marks: 2 })).toBe(false);
    expect(isMarkGain({ marks_on_gun: 1, prev_marks: null })).toBe(false);
  });
});

describe('isMasteryGain', () => {
  it('fires only on reaching the top mastery', () => {
    expect(isMasteryGain({ row: { mark_of_mastery: FEED.aceMastery, prev_mastery: FEED.aceMastery - 1 }, aceMastery: FEED.aceMastery })).toBe(true);
    expect(isMasteryGain({ row: { mark_of_mastery: FEED.aceMastery - 1, prev_mastery: 0 }, aceMastery: FEED.aceMastery })).toBe(false);
  });
});

describe('buildFeed', () => {
  it('merges every kind newest first and caps the list', () => {
    const items = buildFeed({
      snapshots: [
        { account_id: 1n, tank_id: 10, captured_at: at('2026-09-20T10:00:00Z'), marks_on_gun: 3, prev_marks: 2, mark_of_mastery: 4, prev_mastery: 3 }
      ],
      records: [{ account_id: 1n, captured_at: at('2026-09-21T10:00:00Z'), max_damage: 9000, prev_max_damage: 8000, max_damage_tank_id: 10 }],
      badges: [{ accountId: 2n, badgeCode: 'weekly-mark-1', awardedAt: at('2026-09-22T10:00:00Z') }],
      nicknames: new Map([[1n, 'Tanker']]),
      aceMastery: FEED.aceMastery,
      limit: 3,
      badgeOf: (code) => ({ code, challenge: null })
    });

    expect(items.map((item) => item.kind)).toEqual(['badge', 'record', 'mark']);
    expect(items[1]?.nickname).toBe('Tanker');
  });

  it('describes a badge through the given lookup and leaves other kinds without one', () => {
    const items = buildFeed({
      snapshots: [],
      records: [{ account_id: 1n, captured_at: at('2026-09-21T10:00:00Z'), max_damage: 9000, prev_max_damage: 8000, max_damage_tank_id: 10 }],
      badges: [{ accountId: 2n, badgeCode: 'weekly-mark-1', awardedAt: at('2026-09-22T10:00:00Z') }],
      nicknames: new Map(),
      aceMastery: FEED.aceMastery,
      limit: FEED.limit,
      badgeOf: (code) => ({ code: code.toUpperCase(), challenge: null })
    });

    expect(items.map((item) => item.badge?.code ?? null)).toEqual(['WEEKLY-MARK-1', null]);
  });
});
