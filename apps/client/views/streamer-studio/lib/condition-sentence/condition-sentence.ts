import type { ChallengeCondition } from '@otmetki/schemas';

import { toRoman } from '@otmetki/icons';
import { isDefined } from 'remeda';

import type {
  BuildConditionSentenceInput,
  ConditionSentence,
  ConditionSentenceText,
  RenderConditionSentenceInput,
  SentenceGoalInput,
  SentenceLead,
  SentencePart
} from './condition-sentence.types';

const OUTCOME_METRICS = ['win', 'survive'] as const;

const leadOf = ({ battles, aggregate }: ChallengeCondition): SentenceLead => {
  if (battles <= 1) {
    return 'single';
  }

  return aggregate === 'single' ? 'each' : aggregate;
};

const goalOf = ({ condition, lead }: SentenceGoalInput): SentencePart[] => {
  const { metric, operator, value } = condition;
  const outcome = OUTCOME_METRICS.find((item) => item === metric);

  if (outcome && (lead === 'single' || lead === 'each')) {
    return [{ key: `goal.${outcome}` }];
  }

  return [{ key: `op.${operator}`, values: { value } }, { key: `metric.${metric}` }];
};

const filtersOf = ({ condition, tankName }: BuildConditionSentenceInput): SentencePart[] => {
  const { tankId, tankType, minTier } = condition;

  if (isDefined(tankId)) {
    return [{ key: 'filter.tank', values: { name: tankName ?? `#${tankId}` } }];
  }

  const byType: SentencePart | undefined = tankType && { key: `filter.type.${tankType}` };
  const byTier: SentencePart | undefined = isDefined(minTier) ? { key: 'filter.tier', values: { tier: toRoman(minTier) } } : undefined;

  return [byType, byTier].filter(isDefined);
};

export const buildConditionSentence = ({ condition, tankName }: BuildConditionSentenceInput): ConditionSentence => {
  const lead = leadOf(condition);

  return {
    lead: { key: `lead.${lead}`, values: { battles: condition.battles } },
    goal: goalOf({ condition, lead }),
    filters: filtersOf({ condition, tankName })
  };
};

export const renderConditionSentence = ({ sentence, translate }: RenderConditionSentenceInput): ConditionSentenceText => {
  const say = ({ key, values }: SentencePart) => translate(key, values);

  return {
    lead: say(sentence.lead),
    goal: sentence.goal.map(say).join(' '),
    filters: sentence.filters.length > 0 ? sentence.filters.map(say).join(', ') : null
  };
};
