import type { ChallengeStatus } from '@bronevik/schemas';

import type { BadgeTone } from '@/ui-kit';

import type { ChallengeFormValues } from '../model/studio.types';

export const CHALLENGE_FORM = {
  expiryMinutes: [30, 60, 120, 240, 720, 1_440],
  battles: { min: 1, max: 20 },
  amountStep: 50,
  titleMax: 120,
  donorMax: 64
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

export const CHALLENGE_CURRENCY = 'RUB';

export const CHALLENGE_TIERS = [5, 6, 7, 8, 9, 10, 11] as const;

export const CHALLENGE_SCOPE_DEFAULTS = {
  tankType: 'lightTank',
  minTier: 8
} as const;

export const CHALLENGE_NOW_REFRESH_MS = 60_000;

export const CHALLENGE_FORM_DEFAULTS: ChallengeFormValues = {
  title: '',
  amount: 500,
  expiresInMinutes: 120,
  condition: { metric: 'damage', operator: 'gte', value: 3_000, battles: 1, aggregate: 'single' }
};
