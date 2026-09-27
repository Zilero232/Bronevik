import { describe, expect, it } from 'vitest';

import { avgBattlesPerDay } from '../avg-battles-per-day';

describe('avgBattlesPerDay', () => {
  it('returns null when no snapshot carries a battles delta', () => {
    expect(avgBattlesPerDay([])).toBeNull();
    expect(avgBattlesPerDay([{ battlesDelta: null, membersCount: 30 }])).toBeNull();
  });

  it('averages the daily battles per member across snapshots', () => {
    expect(
      avgBattlesPerDay([
        { battlesDelta: 300, membersCount: 30 },
        { battlesDelta: 600, membersCount: 30 }
      ])
    ).toBe(15);
  });

  it('keeps a quiet day as zero rather than unknown', () => {
    expect(avgBattlesPerDay([{ battlesDelta: 0, membersCount: 30 }])).toBe(0);
  });

  it('skips snapshots of an empty clan instead of dividing by zero', () => {
    expect(
      avgBattlesPerDay([
        { battlesDelta: 50, membersCount: 0 },
        { battlesDelta: 70, membersCount: 20 }
      ])
    ).toBe(3.5);
  });

  it('rounds to one decimal', () => {
    expect(avgBattlesPerDay([{ battlesDelta: 100, membersCount: 3 }])).toBe(33.3);
  });
});
