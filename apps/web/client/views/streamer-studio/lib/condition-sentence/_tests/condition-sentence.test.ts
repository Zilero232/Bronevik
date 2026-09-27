import type { ChallengeCondition } from '@otmetki/schemas';

import { toRoman } from '@otmetki/icons';
import { challengeConditionSchema, challengeMetricSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { buildConditionSentence, renderConditionSentence } from '../condition-sentence';

const condition = (patch: Partial<ChallengeCondition>): ChallengeCondition =>
  challengeConditionSchema.parse({ metric: 'damage', value: 3_000, ...patch });

const keysOf = (parts: { key: string }[]) => parts.map(({ key }) => key);

describe('buildConditionSentence', () => {
  it('speaks of a single battle whenever only one battle counts, whatever the aggregate', () => {
    challengeConditionSchema.shape.aggregate.unwrap().options.forEach((aggregate) => {
      expect(buildConditionSentence({ condition: condition({ battles: 1, aggregate }), tankName: null }).lead.key).toBe('lead.single');
    });
  });

  it('names the aggregate once several battles count', () => {
    const lead = (aggregate: ChallengeCondition['aggregate']) =>
      buildConditionSentence({ condition: condition({ battles: 3, aggregate }), tankName: null }).lead;

    expect(lead('single').key).toBe('lead.each');
    expect(lead('sum').key).toBe('lead.sum');
    expect(lead('avg').key).toBe('lead.avg');
    expect(lead('sum').values).toEqual({ battles: 3 });
  });

  it('puts the operator and the threshold before every numeric metric', () => {
    const numeric = challengeMetricSchema.options.filter((metric) => metric !== 'win' && metric !== 'survive');

    numeric.forEach((metric) => {
      const { goal } = buildConditionSentence({ condition: condition({ metric, operator: 'lte', value: 7 }), tankName: null });

      expect(goal).toEqual([{ key: 'op.lte', values: { value: 7 } }, { key: `metric.${metric}` }]);
    });
  });

  it('turns a win or survive goal per battle into a plain verb with no threshold', () => {
    const { goal } = buildConditionSentence({ condition: condition({ metric: 'survive', value: 1, battles: 3 }), tankName: null });

    expect(keysOf(goal)).toEqual(['goal.survive']);
  });

  it('counts wins as a number once they are summed over several battles', () => {
    const { goal } = buildConditionSentence({ condition: condition({ metric: 'win', value: 2, battles: 3, aggregate: 'sum' }), tankName: null });

    expect(keysOf(goal)).toEqual(['op.gte', 'metric.win']);
  });

  it('adds no filter when the challenge fits any vehicle', () => {
    expect(buildConditionSentence({ condition: condition({}), tankName: null }).filters).toEqual([]);
  });

  it('lets a specific tank override the class and tier filters', () => {
    const { filters } = buildConditionSentence({
      condition: condition({ tankId: 7_937, tankType: 'heavyTank', minTier: 10 }),
      tankName: 'Объект 140'
    });

    expect(filters).toEqual([{ key: 'filter.tank', values: { name: 'Объект 140' } }]);
  });

  it('still names the tank by id before the vehicle catalogue has loaded', () => {
    const { filters } = buildConditionSentence({ condition: condition({ tankId: 7_937 }), tankName: null });

    expect(String(filters[0]?.values?.name)).toContain('7937');
  });

  it('combines a class and a minimum tier, with the tier as a roman numeral', () => {
    const { filters } = buildConditionSentence({ condition: condition({ tankType: 'lightTank', minTier: 8 }), tankName: null });

    expect(filters).toEqual([{ key: 'filter.type.lightTank' }, { key: 'filter.tier', values: { tier: toRoman(8) } }]);
  });
});

describe('renderConditionSentence', () => {
  const translate = (key: string, values?: Record<string, number | string>) => (values ? `${key}(${Object.values(values).join('|')})` : key);

  it('translates every part and keeps the goal words in order', () => {
    const sentence = buildConditionSentence({ condition: condition({ battles: 3, aggregate: 'sum' }), tankName: null });
    const text = renderConditionSentence({ sentence, translate });

    expect(text.lead).toBe(translate(sentence.lead.key, sentence.lead.values));
    expect(text.goal).toBe(sentence.goal.map(({ key, values }) => translate(key, values)).join(' '));
  });

  it('leaves the filters out when the challenge fits any vehicle', () => {
    const sentence = buildConditionSentence({ condition: condition({}), tankName: null });

    expect(renderConditionSentence({ sentence, translate }).filters).toBeNull();
  });

  it('joins several filters into one list', () => {
    const sentence = buildConditionSentence({ condition: condition({ tankType: 'lightTank', minTier: 8 }), tankName: null });

    expect(renderConditionSentence({ sentence, translate }).filters?.split(', ')).toHaveLength(sentence.filters.length);
  });
});
