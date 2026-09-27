import type { MissionCondition } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { conditionText, visibleConditions } from '../condition-text';

const condition = (patch: Partial<MissionCondition>): MissionCondition => ({
  progressId: 'damage',
  isMain: true,
  isAward: true,
  isHeader: false,
  icon: null,
  goal: null,
  title: null,
  description: null,
  metric: null,
  ...patch
});

describe('conditionText', () => {
  it('prefers the game text', () => {
    expect(conditionText(condition({ description: 'Deal 2000 damage.' }))).toEqual({ kind: 'text', text: 'Deal 2000 damage.' });
  });

  it('describes a series header by its goal', () => {
    expect(conditionText(condition({ progressId: 'battlesSeries', isHeader: true, goal: 5 }))).toEqual({ kind: 'series', goal: 5, title: null });
  });

  it('labels generic win and survive conditions itself', () => {
    expect(conditionText(condition({ progressId: 'win' }))).toEqual({ kind: 'message', key: 'win' });
    expect(conditionText(condition({ progressId: 'crits' }))).toEqual({ kind: 'generic', id: 'crits' });
  });
});

describe('visibleConditions', () => {
  it('splits main and honors conditions and hides helper ones', () => {
    const { main, honors } = visibleConditions([
      condition({ progressId: 'a' }),
      condition({ progressId: 'b', isMain: false }),
      condition({ progressId: 'c', isMain: false, isAward: false })
    ]);

    expect(main.map((item) => item.progressId)).toEqual(['a']);
    expect(honors.map((item) => item.progressId)).toEqual(['b']);
  });
});
