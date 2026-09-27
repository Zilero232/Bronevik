'use client';

import { splitTeams, teamTotals } from '../../../lib/team-split';
import { useReplay } from '../../context';
import { useReplayScoreboardColumns } from '../use-replay-scoreboard-columns';

export const useReplayScoreboard = () => {
  const replay = useReplay();
  const columns = useReplayScoreboardColumns();

  const { allies, enemies } = splitTeams(replay);

  return {
    columns,
    teams: [
      { id: 'allies', players: allies, totals: teamTotals(allies) },
      { id: 'enemies', players: enemies, totals: teamTotals(enemies) }
    ] as const
  };
};
