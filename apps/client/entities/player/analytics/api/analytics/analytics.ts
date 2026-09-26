import type {
  AnalyticsMaps,
  AnalyticsOverview,
  AnalyticsPlatoons,
  AnalyticsRng,
  AnalyticsTank,
  BattleAnalysis,
  FirstWin,
  MyBattle,
  MyBattlesPage,
  Playlist
} from '@otmetki/schemas';

import {
  analyticsMapsSchema,
  analyticsOverviewSchema,
  analyticsPlatoonsSchema,
  analyticsRngSchema,
  analyticsTankSchema,
  battleAnalysisSchema,
  firstWinSchema,
  myBattleSchema,
  myBattlesPageSchema,
  playlistSchema
} from '@otmetki/schemas';

import type {
  AnalyticsAccountInput,
  AnalyticsBattleInput,
  AnalyticsBattlesInput,
  AnalyticsPeriodInput,
  AnalyticsTankInput,
  PlaylistInput
} from './analytics.types';

import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

export const getAnalyticsOverview = ({ signal, ...params }: AnalyticsPeriodInput): Promise<AnalyticsOverview> =>
  fromServer(async () => analyticsOverviewSchema.parse((await api.get('/me/analytics/overview', { ...SESSION_REQUEST, params, signal })).data));

export const getAnalyticsTank = ({ tankId, signal, ...params }: AnalyticsTankInput): Promise<AnalyticsTank> =>
  fromServer(async () => analyticsTankSchema.parse((await api.get(`/me/analytics/tanks/${tankId}`, { ...SESSION_REQUEST, params, signal })).data));

export const getAnalyticsMaps = ({ signal, ...params }: AnalyticsPeriodInput): Promise<AnalyticsMaps> =>
  fromServer(async () => analyticsMapsSchema.parse((await api.get('/me/analytics/maps', { ...SESSION_REQUEST, params, signal })).data));

export const getAnalyticsPlatoons = ({ signal, ...params }: AnalyticsPeriodInput): Promise<AnalyticsPlatoons> =>
  fromServer(async () => analyticsPlatoonsSchema.parse((await api.get('/me/analytics/platoons', { ...SESSION_REQUEST, params, signal })).data));

export const getAnalyticsRng = ({ signal, ...params }: AnalyticsPeriodInput): Promise<AnalyticsRng> =>
  fromServer(async () => analyticsRngSchema.parse((await api.get('/me/analytics/rng', { ...SESSION_REQUEST, params, signal })).data));

export const getMyBattles = ({ signal, ...params }: AnalyticsBattlesInput): Promise<MyBattlesPage> =>
  fromServer(async () => myBattlesPageSchema.parse((await api.get('/me/analytics/battles', { ...SESSION_REQUEST, params, signal })).data));

export const getMyBattle = ({ id, signal }: AnalyticsBattleInput): Promise<MyBattle> =>
  fromServer(async () =>
    myBattleSchema.parse((await api.get(`/me/analytics/battles/${encodeURIComponent(id)}`, { ...SESSION_REQUEST, signal })).data)
  );

export const getBattleAnalysis = ({ id, signal }: AnalyticsBattleInput): Promise<BattleAnalysis> =>
  fromServer(async () =>
    battleAnalysisSchema.parse((await api.get(`/me/analytics/battles/${encodeURIComponent(id)}/analysis`, { ...SESSION_REQUEST, signal })).data)
  );

export const getPlaylist = ({ signal, ...params }: PlaylistInput): Promise<Playlist> =>
  fromServer(async () => playlistSchema.parse((await api.get('/me/analytics/playlist', { ...SESSION_REQUEST, params, signal })).data));

export const getFirstWin = ({ signal, ...params }: AnalyticsAccountInput): Promise<FirstWin> =>
  fromServer(async () => firstWinSchema.parse((await api.get('/me/analytics/first-win', { ...SESSION_REQUEST, params, signal })).data));
