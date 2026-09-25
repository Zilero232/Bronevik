import { describe, expect, it } from 'vitest';

import type { MarkBattle } from '../mark-gains.types';

import { detectMarkGains, markPairKey } from '../mark-gains';

const battle = ({ id, marks, minute, tankId = 1 }: { id: string; marks: number; minute: number; tankId?: number }): MarkBattle => ({
  id,
  accountId: 10n,
  tankId,
  marksOnGun: marks,
  startedAt: new Date(Date.UTC(2026, 8, 25, 12, minute))
});

describe('detectMarkGains', () => {
  it('reports the battle where the marks went up', () => {
    const gains = detectMarkGains({
      battles: [battle({ id: 'a', marks: 1, minute: 0 }), battle({ id: 'b', marks: 2, minute: 5 })],
      previous: new Map([[markPairKey(battle({ id: 'x', marks: 0, minute: 0 })), 1]])
    });

    expect(gains.map((gain) => gain.id)).toEqual(['b']);
  });

  it('stays quiet when there is no earlier value to compare with', () => {
    expect(detectMarkGains({ battles: [battle({ id: 'a', marks: 3, minute: 0 })], previous: new Map() })).toEqual([]);
  });

  it('orders battles by start time, not arrival order', () => {
    const gains = detectMarkGains({
      battles: [battle({ id: 'late', marks: 2, minute: 10 }), battle({ id: 'early', marks: 1, minute: 0 })],
      previous: new Map([[markPairKey(battle({ id: 'x', marks: 0, minute: 0 })), 1]])
    });

    expect(gains.map((gain) => gain.id)).toEqual(['late']);
  });

  it('counts a mark regained after a drop as a new gain', () => {
    const gains = detectMarkGains({
      battles: [battle({ id: 'a', marks: 2, minute: 0 }), battle({ id: 'b', marks: 1, minute: 1 }), battle({ id: 'c', marks: 2, minute: 2 })],
      previous: new Map([[markPairKey(battle({ id: 'x', marks: 0, minute: 0 })), 1]])
    });

    expect(gains.map((gain) => gain.id)).toEqual(['a', 'c']);
  });

  it('keeps tanks apart', () => {
    const previous = new Map([
      [markPairKey(battle({ id: 'x', marks: 0, minute: 0, tankId: 1 })), 2],
      [markPairKey(battle({ id: 'y', marks: 0, minute: 0, tankId: 2 })), 0]
    ]);

    const gains = detectMarkGains({
      battles: [battle({ id: 'a', marks: 2, minute: 0, tankId: 1 }), battle({ id: 'b', marks: 1, minute: 1, tankId: 2 })],
      previous
    });

    expect(gains.map((gain) => gain.id)).toEqual(['b']);
  });
});
