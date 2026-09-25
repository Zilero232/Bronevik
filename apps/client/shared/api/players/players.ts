import type {
  NicknameHistory,
  PlayerActivity,
  PlayerInsights,
  PlayerMarks,
  PlayerProfile,
  PlayerTanksPage,
  Playtime,
  PopularPlayers,
  Session,
  SessionsPage,
  TimeSeries
} from '@bronevik/schemas';

import {
  activitySchema,
  nicknameHistorySchema,
  playerInsightsSchema,
  playerMarksSchema,
  playerProfileSchema,
  playerTanksPageSchema,
  playtimeSchema,
  popularPlayersSchema,
  sessionSchema,
  sessionsPageSchema,
  timeSeriesSchema
} from '@bronevik/schemas';

import type {
  AccountInput,
  PlayerActivityInput,
  PlayerHistoryInput,
  PlayerInsightsInput,
  PlayerLookupInput,
  PlayerSessionInput,
  PlayerSessionsInput,
  PlayerTanksInput,
  PopularPlayersInput
} from './players.types';

import { api } from '../http';
import { fromSource } from '../source';
import {
  mockActivity,
  mockHistory,
  mockInsights,
  mockMarks,
  mockNicknames,
  mockPlaytime,
  mockPopularPlayers,
  mockProfile,
  mockSession,
  mockSessions,
  mockTanks
} from './mock';
import { PLAYERS_REQUEST } from './players.constants';
import { toListParams } from './players.helpers';

const path = (accountId: number, section: string) => `/players/${accountId}/${section}`;

export const getPlayer = ({ idOrNick, signal }: PlayerLookupInput): Promise<PlayerProfile> =>
  fromSource({
    signal,
    mock: () => mockProfile(idOrNick),
    fetch: async () => playerProfileSchema.parse((await api.get(`/players/${encodeURIComponent(idOrNick)}`, { signal })).data)
  });

export const getPopularPlayers = ({
  days = PLAYERS_REQUEST.popularDays,
  limit = PLAYERS_REQUEST.popularLimit,
  signal
}: PopularPlayersInput = {}): Promise<PopularPlayers> =>
  fromSource({
    signal,
    mock: () => mockPopularPlayers({ days, limit }),
    fetch: async () => popularPlayersSchema.parse((await api.get('/players/popular', { params: { days, limit }, signal })).data)
  });

export const getPlayerTanks = ({ accountId, filter = {}, signal }: PlayerTanksInput): Promise<PlayerTanksPage> =>
  fromSource({
    signal,
    mock: () => mockTanks({ accountId, filter }),
    fetch: async () =>
      playerTanksPageSchema.parse(
        (await api.get(path(accountId, 'tanks'), { params: { ...toListParams(filter), limit: PLAYERS_REQUEST.tanksLimit }, signal })).data
      )
  });

export const getPlayerHistory = ({ accountId, metric, granularity, signal }: PlayerHistoryInput): Promise<TimeSeries> =>
  fromSource({
    signal,
    mock: () => mockHistory({ accountId, metric, granularity }),
    fetch: async () => timeSeriesSchema.parse((await api.get(path(accountId, 'history'), { params: { metric, granularity }, signal })).data)
  });

export const getPlayerActivity = ({ accountId, days, signal }: PlayerActivityInput): Promise<PlayerActivity> =>
  fromSource({
    signal,
    mock: () => mockActivity({ accountId, days }),
    fetch: async () => activitySchema.parse((await api.get(path(accountId, 'activity'), { params: { days }, signal })).data)
  });

export const getPlayerSessions = ({ accountId, limit, offset, signal }: PlayerSessionsInput): Promise<SessionsPage> =>
  fromSource({
    signal,
    mock: () => mockSessions({ accountId, limit, offset }),
    fetch: async () => sessionsPageSchema.parse((await api.get(path(accountId, 'sessions'), { params: { limit, offset }, signal })).data)
  });

export const getPlayerSession = ({ accountId, sessionId, signal }: PlayerSessionInput): Promise<Session> =>
  fromSource({
    signal,
    mock: () => mockSession({ accountId, sessionId }),
    fetch: async () => sessionSchema.parse((await api.get(path(accountId, `sessions/${sessionId}`), { signal })).data)
  });

export const getPlayerMarks = ({ accountId, signal }: AccountInput): Promise<PlayerMarks> =>
  fromSource({
    signal,
    mock: () => mockMarks(accountId),
    fetch: async () => playerMarksSchema.parse((await api.get(path(accountId, 'marks'), { signal })).data)
  });

export const getPlayerInsights = ({ accountId, period, signal }: PlayerInsightsInput): Promise<PlayerInsights> =>
  fromSource({
    signal,
    mock: () => mockInsights({ accountId, period }),
    fetch: async () => playerInsightsSchema.parse((await api.get(path(accountId, 'insights'), { params: { period }, signal })).data)
  });

export const getPlayerPlaytime = ({ accountId, signal }: AccountInput): Promise<Playtime> =>
  fromSource({
    signal,
    mock: () => mockPlaytime(accountId),
    fetch: async () => playtimeSchema.parse((await api.get(path(accountId, 'playtime'), { signal })).data)
  });

export const getNicknameHistory = ({ accountId, signal }: AccountInput): Promise<NicknameHistory> =>
  fromSource({
    signal,
    mock: () => mockNicknames(accountId),
    fetch: async () => nicknameHistorySchema.parse((await api.get(path(accountId, 'nickname-history'), { signal })).data)
  });
