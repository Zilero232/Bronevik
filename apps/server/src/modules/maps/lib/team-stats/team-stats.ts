import type { MapStats } from '@bronevik/schemas';

import type { BattleSideRow, ToStatsInput, WinnerRow } from './team-stats.types';

import { percentOf } from '../../../../common/lib';
import { MAP_TEAMS } from '../../config';

const otherTeam = (team: number): number => MAP_TEAMS.teams.find((candidate) => candidate !== team) ?? team;

const toStats = ({ source, winners }: ToStatsInput): MapStats | null => {
  const battles = winners.length;

  if (battles === 0) {
    return null;
  }

  return {
    source,
    battles,
    teams: MAP_TEAMS.teams.map((team) => ({
      team,
      battles,
      winRate: percentOf({ value: winners.filter((winner) => winner === team).length, by: battles })
    }))
  };
};

export const statsFromBattles = (rows: readonly BattleSideRow[]): MapStats | null =>
  toStats({
    source: 'battles',
    winners: rows.flatMap((row): (number | null)[] => {
      if (row.team === null || !MAP_TEAMS.teams.includes(row.team)) {
        return [];
      }

      if (row.result === 'draw') {
        return [null];
      }

      return [row.result === 'win' ? row.team : otherTeam(row.team)];
    })
  });

export const statsFromReplays = (rows: readonly WinnerRow[]): MapStats | null =>
  toStats({
    source: 'replays',
    winners: rows.flatMap((row) => Array.from<number | null>({ length: Math.max(0, Math.round(row.battles)) }).fill(row.winner))
  });
