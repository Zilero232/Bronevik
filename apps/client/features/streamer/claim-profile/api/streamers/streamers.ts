import type { StreamerClaim } from '@otmetki/schemas';

import type { StartClaimRequest } from '@/entities/streamer/streamer';

import { streamersControllerClaim, streamersControllerClaimStatus, streamersControllerVerifyClaim } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getClaimStatus = async (slug: string): Promise<StreamerClaim | null> =>
  (await fromSdk(() => streamersControllerClaimStatus({ ...SESSION_REQUEST, path: { slug } }))).claim;

export const startClaim = ({ slug, ...body }: StartClaimRequest): Promise<StreamerClaim> =>
  fromSdk(() => streamersControllerClaim({ ...SESSION_REQUEST, path: { slug }, body }));

export const verifyClaim = (slug: string): Promise<StreamerClaim> =>
  fromSdk(() => streamersControllerVerifyClaim({ ...SESSION_REQUEST, path: { slug } }));
