import type { ClanEventsPage, ClanListPage, ClanPage, ClanStronghold } from '@otmetki/schemas';

import { clansControllerEvents, clansControllerList, clansControllerPage, clansControllerStronghold } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { ClanEventsInput, ClanListInput, ClanPageInput, ClanStrongholdInput } from './clans.types';

import { CLAN_REQUEST } from './clans.constants';

export const getClan = ({ signal, idOrTag }: ClanPageInput): Promise<ClanPage> => fromSdk(() => clansControllerPage({ path: { idOrTag }, signal }));

export const listClanEvents = ({ signal, clanId, limit = CLAN_REQUEST.eventsLimit, offset = 0 }: ClanEventsInput): Promise<ClanEventsPage> =>
  fromSdk(() => clansControllerEvents({ path: { id: clanId }, query: { limit, offset }, signal }));

export const listClans = ({ signal, limit = CLAN_REQUEST.listLimit, offset = 0, ...query }: ClanListInput): Promise<ClanListPage> =>
  fromSdk(() => clansControllerList({ query: { ...query, limit, offset }, signal }));

export const getClanStronghold = ({ signal, clanId }: ClanStrongholdInput): Promise<ClanStronghold> =>
  fromSdk(() => clansControllerStronghold({ path: { id: clanId }, signal }));
