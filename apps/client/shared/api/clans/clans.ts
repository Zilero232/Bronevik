import type { ClanEventsPage, ClanListPage, ClanPage, ClanStronghold } from '@bronevik/schemas';

import { clanEventsPageSchema, clanListPageSchema, clanPageSchema, clanStrongholdSchema } from '@bronevik/schemas';

import type { ClanEventsInput, ClanListInput, ClanPageInput, ClanStrongholdInput } from './clans.types';

import { api, orNotFound } from '../http';
import { fromSource } from '../source';
import { CLAN_REQUEST } from './clans.constants';
import { mockClanEvents, mockClanList, mockClanPage, mockClanStronghold } from './clans.mock';

export const getClan = ({ signal, idOrTag }: ClanPageInput): Promise<ClanPage> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockClanPage(idOrTag)),
    fetch: async () => {
      const { data } = await api.get(`/clans/${encodeURIComponent(idOrTag)}`, { signal });

      return clanPageSchema.parse(data);
    }
  });

export const listClanEvents = ({ signal, clanId, limit = CLAN_REQUEST.eventsLimit, offset = 0 }: ClanEventsInput): Promise<ClanEventsPage> =>
  fromSource({
    signal,
    mock: () => mockClanEvents({ clanId, limit, offset }),
    fetch: async () => {
      const { data } = await api.get(`/clans/${clanId}/events`, { params: { limit, offset }, signal });

      return clanEventsPageSchema.parse(data);
    }
  });

export const listClans = ({ signal, limit = CLAN_REQUEST.listLimit, offset = 0, ...query }: ClanListInput): Promise<ClanListPage> =>
  fromSource({
    signal,
    mock: () => mockClanList({ ...query, limit, offset }),
    fetch: async () => {
      const { data } = await api.get('/clans', { params: { ...query, limit, offset }, signal });

      return clanListPageSchema.parse(data);
    }
  });

export const getClanStronghold = ({ signal, clanId }: ClanStrongholdInput): Promise<ClanStronghold> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockClanStronghold(clanId)),
    fetch: async () => {
      const { data } = await api.get(`/clans/${clanId}/stronghold`, { signal });

      return clanStrongholdSchema.parse(data);
    }
  });
