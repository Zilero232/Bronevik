import { socialControllerFeed } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { SocialFeed, SocialFeedInput } from './feed.types';

export const getSocialFeed = ({ days, signal }: SocialFeedInput): Promise<SocialFeed> =>
  fromSdk(() => socialControllerFeed({ ...SESSION_REQUEST, query: { days }, signal }));
