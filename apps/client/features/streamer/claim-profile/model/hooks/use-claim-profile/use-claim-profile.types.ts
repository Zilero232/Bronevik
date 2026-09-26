import type { ClaimFailure } from '../../../lib/claim-state';

export type ClaimView = 'pending' | 'ready' | 'signIn' | ClaimFailure;

export type InstantClaimMethod = 'bio_code' | 'oauth';
