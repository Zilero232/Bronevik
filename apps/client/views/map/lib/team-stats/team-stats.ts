import type { MapTeams, TeamWinRates, WinRateOfInput } from './team-stats.types';

import { MAP_TEAMS } from '../../config';
import { teamShare } from '../battle-duration';

const winRateOf = ({ teams, team }: WinRateOfInput) => teams.find((row) => row.team === team)?.winRate ?? 0;

export const teamWinRates = (teams: MapTeams): TeamWinRates => {
  const team1 = winRateOf({ teams, team: MAP_TEAMS.first });
  const team2 = winRateOf({ teams, team: MAP_TEAMS.second });

  return { team1, team2, draws: Math.max(0, 100 - team1 - team2), share: teamShare({ team1, team2 }) };
};
