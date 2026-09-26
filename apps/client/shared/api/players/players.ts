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

import {
  playersControllerActivity,
  playersControllerInsights,
  playersControllerMarks,
  playersControllerNicknames,
  playersControllerPlayerTanks,
  playersControllerPlaytime,
  playersControllerPopular,
  playersControllerProfile,
  playersControllerSeries,
  playersControllerSession,
  playersControllerSessionList
} from '../generated';
import { listParam } from '../http';
import { fromSdk } from '../source';
import { PLAYERS_REQUEST } from './players.constants';

export const getPlayer = ({ idOrNick, signal }: PlayerLookupInput): Promise<PlayerProfile> =>
  fromSdk(() => playersControllerProfile({ path: { idOrNick }, signal }));

export const getPopularPlayers = ({
  days = PLAYERS_REQUEST.popularDays,
  limit = PLAYERS_REQUEST.popularLimit,
  signal
}: PopularPlayersInput = {}): Promise<PopularPlayers> => fromSdk(() => playersControllerPopular({ query: { days, limit }, signal }));

export const getPlayerTanks = ({ accountId, filter = {}, signal }: PlayerTanksInput): Promise<PlayerTanksPage> =>
  fromSdk(() =>
    playersControllerPlayerTanks({
      path: { id: accountId },
      query: {
        ...filter,
        tiers: listParam(filter.tiers),
        types: listParam(filter.types),
        nations: listParam(filter.nations),
        limit: PLAYERS_REQUEST.tanksLimit
      },
      signal
    })
  );

export const getPlayerHistory = ({ accountId, metric, granularity, signal }: PlayerHistoryInput): Promise<TimeSeries> =>
  fromSdk(() => playersControllerSeries({ path: { id: accountId }, query: { metric, granularity }, signal }));

export const getPlayerActivity = ({ accountId, days, signal }: PlayerActivityInput): Promise<PlayerActivity> =>
  fromSdk(() => playersControllerActivity({ path: { id: accountId }, query: { days }, signal }));

export const getPlayerSessions = ({ accountId, limit, offset, signal }: PlayerSessionsInput): Promise<SessionsPage> =>
  fromSdk(() => playersControllerSessionList({ path: { id: accountId }, query: { limit, offset }, signal }));

export const getPlayerSession = ({ accountId, sessionId, signal }: PlayerSessionInput): Promise<Session> =>
  fromSdk(() => playersControllerSession({ path: { id: accountId, sessionId }, signal }));

export const getPlayerMarks = ({ accountId, signal }: AccountInput): Promise<PlayerMarks> =>
  fromSdk(() => playersControllerMarks({ path: { id: accountId }, signal }));

export const getPlayerInsights = ({ accountId, period, signal }: PlayerInsightsInput): Promise<PlayerInsights> =>
  fromSdk(() => playersControllerInsights({ path: { id: accountId }, query: { period }, signal }));

export const getPlayerPlaytime = ({ accountId, signal }: AccountInput): Promise<Playtime> =>
  fromSdk(() => playersControllerPlaytime({ path: { id: accountId }, signal }));

export const getNicknameHistory = ({ accountId, signal }: AccountInput): Promise<NicknameHistory> =>
  fromSdk(() => playersControllerNicknames({ path: { id: accountId }, signal }));
