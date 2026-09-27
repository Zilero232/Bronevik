import type { CrewSkillPick } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { orderCrew, shellKindKey } from '../build-usage';

const skill = (name: string, share: number, avgPosition: number): CrewSkillPick => ({
  skill: name,
  name,
  image: null,
  isCommon: false,
  share,
  avgPosition
});

describe('shellKindKey', () => {
  it('keeps the known kinds and folds the rest into unknown', () => {
    expect(shellKindKey('HOLLOW_CHARGE')).toBe('HOLLOW_CHARGE');
    expect(shellKindKey('SMOKE')).toBe('unknown');
    expect(shellKindKey(null)).toBe('unknown');
  });
});

describe('orderCrew', () => {
  it('orders roles like the constructor and skills by learning order within the most picked ones', () => {
    const crew = orderCrew({
      crew: [
        { role: 'loader', members: 2, skills: [skill('b', 0.9, 1), skill('a', 0.8, 0), skill('c', 0.1, 2)] },
        { role: 'commander', members: 1, skills: [skill('x', 1, 0)] },
        { role: 'radioman', members: 1, skills: [] },
        { role: 'mystery', members: 1, skills: [skill('z', 1, 0)] }
      ],
      skillsPerRole: 2
    });

    expect(crew.map((role) => role.role)).toEqual(['commander', 'loader']);
    expect(crew[1]?.skills.map((entry) => entry.skill)).toEqual(['a', 'b']);
  });
});
