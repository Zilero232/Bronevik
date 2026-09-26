import type { ReplayPlayer as ReplayPlayerView, ReplaySummary as ReplayView } from '@bronevik/schemas';

import type { ReplayPlayer } from '../../../../lib/replay';
import type { ToReplayViewInput } from './replay-view.types';

import { replaySummarySchema } from '../../../../lib/replay';
import { REPLAY_LINKS } from '../../config';

const toPlayerView = (player: ReplayPlayer): ReplayPlayerView | null => {
  if (player.accountId === null || player.accountId <= 0 || player.tankId === null || player.tankId <= 0) {
    return null;
  }

  return {
    accountId: player.accountId,
    nickname: player.name,
    clanTag: player.clanTag || null,
    team: Math.min(2, Math.max(1, player.team)),
    tankId: player.tankId,
    damageDealt: player.result ? Math.max(0, Math.round(player.result.damageDealt)) : null,
    frags: player.result ? Math.max(0, Math.round(player.result.frags)) : null,
    survived: player.result?.survived ?? null
  };
};

const readStoredSummary = (value: unknown) => {
  const parsed = replaySummarySchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};

export const toReplayView = ({ replay, apiUrl }: ToReplayViewInput): ReplayView => {
  const summary = readStoredSummary(replay.summary);
  const players = (summary?.players ?? []).flatMap((player) => {
    const view = toPlayerView(player);

    return view ? [{ view, isRecorder: player.isRecorder }] : [];
  });

  return {
    id: replay.id,
    status: replay.status,
    visibility: replay.visibility,
    gameVersion: replay.gameVersion,
    arenaId: replay.arenaId,
    mapName: replay.mapName,
    battleType: replay.gameplayMode ?? replay.battleType,
    playedAt: replay.playedAt?.toISOString() ?? null,
    owner: players.find((player) => player.isRecorder)?.view ?? null,
    result: replay.result,
    damageDealt: replay.damageDealt,
    damageAssisted: replay.damageAssisted,
    frags: replay.frags,
    xp: replay.xp,
    medals: replay.medals,
    players: players.map((player) => player.view),
    durationSec: summary?.durationSeconds === null || summary?.durationSeconds === undefined ? null : Math.round(summary.durationSeconds),
    views: replay.views,
    downloadUrl: new URL(REPLAY_LINKS.file.replace('{id}', replay.id), apiUrl).href,
    createdAt: replay.createdAt.toISOString()
  };
};
