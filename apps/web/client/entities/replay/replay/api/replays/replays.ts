import { replaysControllerGet, replaysControllerHeatmap, replaysControllerMine, replaysControllerSearch } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { Heatmap, HeatmapInput, MyReplaysInput, Replay, ReplayDetailInput, ReplayPage, ReplaySearchInput } from './replays.types';

export const listReplays = ({ signal, ...query }: ReplaySearchInput): Promise<ReplayPage> =>
  fromSdk(() => replaysControllerSearch({ query, signal }));

export const listMyReplays = ({ signal, ...query }: MyReplaysInput): Promise<ReplayPage> =>
  fromSdk(() => replaysControllerMine({ ...SESSION_REQUEST, query, signal }));

export const getReplay = ({ id, signal }: ReplayDetailInput): Promise<Replay> =>
  fromSdk(() => replaysControllerGet({ ...SESSION_REQUEST, path: { id }, signal }));

export const getHeatmap = ({ arenaId, signal, ...query }: HeatmapInput): Promise<Heatmap> =>
  fromSdk(() => replaysControllerHeatmap({ path: { arenaId }, query, signal }));
