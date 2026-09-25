import { describe, expect, it } from 'vitest';

import { WEEKLY_CHALLENGES } from '../../../config';
import { badgeCodeOf, challengeProgress, isCompleted } from '../challenges';

const empty = { battles: 0, wins: 0, spotted: 0, marks: 0, bigDamage: [] };
const heavy = WEEKLY_CHALLENGES.find((definition) => definition.code === 'heavy-4000');
const damage = WEEKLY_CHALLENGES.find((definition) => definition.code === 'damage-3000');

describe('challengeProgress', () => {
  it('counts only big battles on the required vehicle class', () => {
    if (!heavy) {
      throw new Error('heavy challenge missing');
    }

    const stats = {
      ...empty,
      bigDamage: [
        { damage: heavy.threshold, vehicleType: 'heavyTank' },
        { damage: heavy.threshold - 1, vehicleType: 'heavyTank' },
        { damage: heavy.threshold * 2, vehicleType: 'mediumTank' }
      ]
    };

    expect(challengeProgress({ definition: heavy, stats })).toBe(1);
  });

  it('counts every class when none is required', () => {
    if (!damage) {
      throw new Error('damage challenge missing');
    }

    expect(challengeProgress({ definition: damage, stats: { ...empty, bigDamage: [{ damage: damage.threshold, vehicleType: null }] } })).toBe(1);
  });
});

describe('isCompleted', () => {
  it('completes exactly at the target', () => {
    for (const definition of WEEKLY_CHALLENGES.filter((item) => item.metric === 'battles')) {
      expect(isCompleted({ definition, stats: { ...empty, battles: definition.target } })).toBe(true);
      expect(isCompleted({ definition, stats: { ...empty, battles: definition.target - 1 } })).toBe(false);
    }
  });
});

describe('badgeCodeOf', () => {
  it('gives every challenge its own badge', () => {
    const codes = WEEKLY_CHALLENGES.map(badgeCodeOf);

    expect(new Set(codes).size).toBe(codes.length);
  });
});
