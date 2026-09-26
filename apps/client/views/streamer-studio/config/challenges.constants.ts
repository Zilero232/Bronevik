import type { ChallengeStatus } from '@bronevik/schemas';

import { challengeConditionSchema, challengeMetricSchema } from '@bronevik/schemas';

import type { BadgeTone } from '@/ui-kit';

export const CHALLENGE_FORM = {
  expiryMinutes: [30, 60, 120, 240, 720, 1_440],
  battles: { min: 1, max: 20 },
  amountStep: 50,
  titleMax: 120
} as const;

export const CHALLENGE_CONDITION_OPTIONS = {
  metrics: challengeMetricSchema.options,
  operators: challengeConditionSchema.shape.operator.unwrap().options,
  aggregates: challengeConditionSchema.shape.aggregate.unwrap().options
} as const;

export const CHALLENGE_SCOPES = ['any', 'tank', 'type', 'tier'] as const;

export type ChallengeScope = (typeof CHALLENGE_SCOPES)[number];

export const CHALLENGE_STATUS_TONE: Record<ChallengeStatus, BadgeTone> = {
  pending: 'warning',
  active: 'accent',
  succeeded: 'success',
  failed: 'danger',
  cancelled: 'neutral',
  expired: 'neutral',
  refunded: 'steel'
};

export const CHALLENGE_TIERS = [5, 6, 7, 8, 9, 10, 11] as const;

export const CHALLENGE_SCOPE_DEFAULTS = {
  tankType: 'lightTank',
  minTier: 8
} as const;

export const CHALLENGE_NOW_REFRESH_MS = 60_000;
