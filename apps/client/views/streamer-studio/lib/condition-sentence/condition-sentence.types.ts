import type { ChallengeCondition, ChallengeMetric, VehicleType } from '@bronevik/schemas';

export type SentenceLead = 'avg' | 'each' | 'single' | 'sum';

export type SentenceKey =
  | 'filter.tank'
  | 'filter.tier'
  | `filter.type.${VehicleType}`
  | `goal.${'survive' | 'win'}`
  | `lead.${SentenceLead}`
  | `metric.${ChallengeMetric}`
  | `op.${ChallengeCondition['operator']}`;

export type SentencePart = {
  key: SentenceKey;
  values?: Record<string, number | string>;
};

export type ConditionSentence = {
  lead: SentencePart;
  goal: SentencePart[];
  filters: SentencePart[];
};

export type BuildConditionSentenceInput = {
  condition: ChallengeCondition;
  tankName: string | null;
};

export type SentenceGoalInput = {
  condition: ChallengeCondition;
  lead: SentenceLead;
};
