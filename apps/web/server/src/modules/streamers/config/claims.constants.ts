import type { ClaimMethod } from '@otmetki/schemas';

import type { StreamerClaimMethod } from '../../../../generated';

export const CLAIM = {
  codePrefix: 'otmetki-',
  codeBytes: 3,
  oauthPlatforms: ['twitch'],
  bioPlatforms: ['twitch', 'vkVideoLive', 'youtube']
} as const;

export const CLAIM_METHOD_TO_DB = {
  oauth: 'oauth',
  bio_code: 'bioCode',
  manual: 'manual'
} as const satisfies Record<ClaimMethod, StreamerClaimMethod>;

export const CLAIM_METHOD_FROM_DB = {
  oauth: 'oauth',
  bioCode: 'bio_code',
  manual: 'manual'
} as const satisfies Record<StreamerClaimMethod, ClaimMethod>;
