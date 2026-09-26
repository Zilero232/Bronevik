import type { MapDetail } from '@bronevik/schemas';

export type MapTeams = NonNullable<MapDetail['stats']>['teams'];

export type TeamWinRates = {
  team1: number;
  team2: number;
  draws: number;
  share: number;
};

export type WinRateOfInput = {
  teams: MapTeams;
  team: number;
};
