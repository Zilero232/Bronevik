import type { BattleResult, ChallengeCondition } from '@otmetki/schemas';

export type EvaluatedBattle = {
  id: string;
  tankId: number;
  tankType: string | null;
  tier: number | null;
  startedAt: Date;
  result: BattleResult;
  damageDealt: number;
  damageAssistedRadio: number;
  damageAssistedTrack: number;
  damageBlocked: number;
  frags: number;
  spotted: number;
  xp: number;
  survived: boolean;
  moePercent: number | null;
};

type ChallengeProgress = {
  battles: number;
  value: number;
  battleIds: string[];
};

export type EvaluateChallengeInput = {
  condition: ChallengeCondition;
  battles: readonly EvaluatedBattle[];
};

export type ChallengeVerdict = {
  status: 'active' | 'failed' | 'succeeded';
  progress: ChallengeProgress;
  decidingBattleId: string | null;
};

export type CompareInput = {
  operator: ChallengeCondition['operator'];
  actual: number;
  target: number;
};

export type MetricOfInput = {
  metric: ChallengeCondition['metric'];
  battle: EvaluatedBattle;
};

export type EligibleInput = {
  condition: ChallengeCondition;
  battle: EvaluatedBattle;
};
