import type { StreamerClaim } from '@otmetki/schemas';

import { isAxiosError } from 'axios';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import type { ClaimFailure, ClaimStage } from './claim-state.types';

import { CLAIM_PROFILE } from '../../config';

export const claimStage = (claim: StreamerClaim | null): ClaimStage =>
  match(claim)
    .with(null, () => 'none' as const)
    .with({ status: 'resolved' }, () => 'resolved' as const)
    .with({ status: 'dismissed' }, () => 'dismissed' as const)
    .with({ method: 'bio_code', code: P.string }, () => 'code' as const)
    .otherwise(() => 'review' as const);

export const claimFailure = (error: unknown): ClaimFailure =>
  isNotFoundError(error) || (isAxiosError(error) && error.response?.status === CLAIM_PROFILE.conflictStatus) ? 'missing' : 'failed';
