import { describe, expect, it } from 'vitest';

import { weeklyReport } from '../weekly-report';

describe('weeklyReport', () => {
  it('counts only settled attendance in the rate', () => {
    const report = weeklyReport({
      events: 2,
      attendance: ['attended', 'absent', 'confirmed', 'invited', 'attended'],
      newCandidates: 1,
      inactiveMembers: 3
    });

    expect(report.attendanceRate).toBeCloseTo(2 / 3);
  });

  it('has no rate before anyone was marked', () => {
    expect(weeklyReport({ events: 0, attendance: ['invited'], newCandidates: 0, inactiveMembers: 0 }).attendanceRate).toBeNull();
  });
});
