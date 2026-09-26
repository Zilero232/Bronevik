import type { ClaimFailure } from '../../../lib/claim-state';

export type ClaimView = ClaimFailure | 'pending' | 'ready' | 'signIn';

export type InstantClaimMethod = 'bio_code' | 'oauth';
