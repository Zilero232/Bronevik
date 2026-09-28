import { parseAsStringLiteral } from 'nuqs';

import type { DeltaVerdict } from '@/shared/lib';
import type { BadgeTone } from '@/ui-kit';

import type { SupertestVerdict } from '../model/supertest.types';

export const SUPERTEST_SCOPES = ['all', 'mine'] as const;

export const SUPERTEST_PARAMS = {
  scope: parseAsStringLiteral(SUPERTEST_SCOPES).withDefault('all')
};

export const VERDICT_TONE = {
  buff: 'success',
  nerf: 'danger',
  neutral: 'neutral'
} as const satisfies Record<SupertestVerdict, BadgeTone>;

export const VERDICT_DELTA = {
  buff: 'better',
  nerf: 'worse',
  neutral: 'same'
} as const satisfies Record<SupertestVerdict, DeltaVerdict>;

export const SUPERTEST = {
  staleMs: 15 * 60_000,
  plusFeature: 'supertest',
  plusScope: 'mine'
} as const;
