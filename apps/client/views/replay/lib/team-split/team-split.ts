import { sortBy, sumBy } from 'remeda';

import type { ReplayPlayer } from '@/entities/replay/replay';

import type { SplitTeamsInput, TeamSplit, TeamTotals } from './team-split.types';

const byContribution = (players: readonly ReplayPlayer[]): ReplayPlayer[] =>
  sortBy(players, [(player) => player.xp ?? -1, 'desc'], [(player) => player.damageDealt ?? -1, 'desc']);

export const recorderTeamOf = ({ owner, players }: SplitTeamsInput): number =>
  owner?.team ?? players.find((player) => player.isRecorder === true)?.team ?? 1;

export const splitTeams = (replay: SplitTeamsInput): TeamSplit => {
  const recorderTeam = recorderTeamOf(replay);

  return {
    recorderTeam,
    allies: byContribution(replay.players.filter((player) => player.team === recorderTeam)),
    enemies: byContribution(replay.players.filter((player) => player.team !== recorderTeam))
  };
};

export const teamTotals = (players: readonly ReplayPlayer[]): TeamTotals => ({
  players: players.length,
  alive: players.filter((player) => player.survived === true).length,
  damageDealt: sumBy(players, (player) => player.damageDealt ?? 0),
  frags: sumBy(players, (player) => player.frags ?? 0),
  xp: sumBy(players, (player) => player.xp ?? 0)
});

export const hitRate = (player: Pick<ReplayPlayer, 'hits' | 'shots'>): number | null =>
  player.shots === null || player.hits === null || player.shots === 0 ? null : player.hits / player.shots;
