import { socialControllerLeague } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { LeagueInput, SocialLeague } from './league.types';

export const getLeague = ({ scope, metric, week, signal }: LeagueInput): Promise<SocialLeague> =>
  fromSdk(() => socialControllerLeague({ ...SESSION_REQUEST, query: { scope, metric, ...(week ? { week } : {}) }, signal }));
