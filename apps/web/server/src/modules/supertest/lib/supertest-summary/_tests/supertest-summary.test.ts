import { describe, expect, it } from 'vitest';

import { narrowToTanks, supertestTotals, tankVerdict } from '../supertest-summary';

const ANNOUNCEMENTS = [
  {
    id: 'a',
    tanks: [
      { key: 'tank:1', tankId: 1, changes: [{ verdict: 'buff' as const }, { verdict: 'nerf' as const }, { verdict: 'buff' as const }] },
      { key: 'name:прототип', tankId: null, changes: [{ verdict: 'neutral' as const }] }
    ]
  },
  { id: 'b', tanks: [{ key: 'tank:2', tankId: 2, changes: [{ verdict: 'nerf' as const }] }] },
  { id: 'c', tanks: [{ key: 'tank:1', tankId: 1, changes: [{ verdict: 'buff' as const }] }] }
];

describe('tankVerdict', () => {
  it('follows the majority of changes', () => {
    expect(tankVerdict(['buff', 'buff', 'nerf'])).toBe('buff');
    expect(tankVerdict(['nerf', 'neutral'])).toBe('nerf');
  });

  it('is neutral for a tie or no changes', () => {
    expect(tankVerdict(['buff', 'nerf'])).toBe('neutral');
    expect(tankVerdict([])).toBe('neutral');
  });
});

describe('supertestTotals', () => {
  it('counts a tank that appears in several announcements once', () => {
    expect(supertestTotals(ANNOUNCEMENTS).tanks).toBe(3);
  });

  it('counts buffs and nerfs over every change', () => {
    expect(supertestTotals(ANNOUNCEMENTS)).toMatchObject({ announcements: 3, buffs: 3, nerfs: 2 });
  });

  it('is all zeros for no announcements', () => {
    expect(supertestTotals([])).toEqual({ announcements: 0, tanks: 0, buffs: 0, nerfs: 0 });
  });
});

describe('narrowToTanks', () => {
  it('keeps only the owned tanks and drops announcements left empty', () => {
    const narrowed = narrowToTanks({ announcements: ANNOUNCEMENTS, tankIds: new Set([1]) });

    expect(narrowed.map((announcement) => announcement.id)).toEqual(['a', 'c']);
    expect(narrowed[0]?.tanks.map((tank) => tank.key)).toEqual(['tank:1']);
  });

  it('never keeps vehicles that are not in the catalog', () => {
    const narrowed = narrowToTanks({ announcements: ANNOUNCEMENTS, tankIds: new Set([99]) });

    expect(narrowed).toEqual([]);
  });
});
