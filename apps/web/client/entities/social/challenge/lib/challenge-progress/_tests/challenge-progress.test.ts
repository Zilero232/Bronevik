import { WEEKLY_CHALLENGE_METRICS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { LOCALES, messages } from '@/shared/i18n';

import type { WeeklyChallenge } from '../../../api';

import { challengeRows, challengeSummary, secondsUntil } from '../challenge-progress';

const challenge = (overrides: Partial<WeeklyChallenge>): WeeklyChallenge => ({
  code: 'battles-50',
  metric: 'battles',
  target: 50,
  threshold: null,
  vehicleType: null,
  badgeCode: 'weekly-battles-50',
  progress: [],
  ...overrides
});

describe('challengeRows', () => {
  it('takes the best linked account and caps the share', () => {
    const [row] = challengeRows([
      challenge({
        progress: [
          { accountId: 1, value: 20, completedAt: null },
          { accountId: 2, value: 70, completedAt: null }
        ]
      })
    ]);

    expect(row).toMatchObject({ value: 70, share: 1, isCompleted: true, completedAt: null });
  });

  it('keeps the earliest completion time', () => {
    const [row] = challengeRows([
      challenge({
        progress: [
          { accountId: 1, value: 50, completedAt: '2026-09-24T10:00:00Z' },
          { accountId: 2, value: 55, completedAt: '2026-09-23T10:00:00Z' }
        ]
      })
    ]);

    expect(row?.completedAt).toBe('2026-09-23T10:00:00Z');
  });

  it('starts from zero without progress', () => {
    expect(challengeRows([challenge({})])[0]).toMatchObject({ value: 0, share: 0, isCompleted: false });
  });

  it('keeps the metric key and the vehicle type the server sent', () => {
    const [row] = challengeRows([challenge({ code: 'heavy', metric: 'bigDamageBattles', threshold: 4_000, vehicleType: 'heavyTank', target: 3 })]);

    expect(row).toMatchObject({ metric: 'bigDamageBattles', vehicleType: 'heavyTank', threshold: 4_000 });
  });

  it('puts open challenges first, the closest to done on top', () => {
    const rows = challengeRows([
      challenge({ code: 'done', progress: [{ accountId: 1, value: 50, completedAt: '2026-09-22T10:00:00Z' }] }),
      challenge({ code: 'low', progress: [{ accountId: 1, value: 5, completedAt: null }] }),
      challenge({ code: 'high', progress: [{ accountId: 1, value: 40, completedAt: null }] })
    ]);

    expect(rows.map(({ code }) => code)).toEqual(['high', 'low', 'done']);
  });
});

describe('challengeSummary', () => {
  it('counts the completed challenges', () => {
    const rows = challengeRows([challenge({ progress: [{ accountId: 1, value: 50, completedAt: null }] }), challenge({ code: 'x' })]);

    expect(challengeSummary(rows)).toEqual({ completed: 1, total: 2 });
  });
});

describe('secondsUntil', () => {
  it('counts the seconds to the end of the week', () => {
    expect(secondsUntil({ endsAt: '2026-09-28T00:00:00Z', now: new Date('2026-09-27T23:00:00Z') })).toBe(3_600);
  });
});

describe('challenge titles', () => {
  it('names every metric the server can send, in every locale', () => {
    for (const locale of LOCALES) {
      expect(Object.keys(messages[locale].social.challenges.titles).sort()).toEqual([...WEEKLY_CHALLENGE_METRICS].sort());
    }
  });
});
