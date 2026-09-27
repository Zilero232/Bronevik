import type { League, SocialControllerLeagueData } from '@/shared/api/generated';

export type SocialLeague = League;

export type LeagueEntry = League['entries'][number];

export type LeagueMetric = League['metric'];

export type LeagueScope = League['scope'];

export type LeagueDivision = NonNullable<League['division']>;

export type LeagueTier = LeagueDivision['tier'];

export type LeagueZone = NonNullable<LeagueEntry['zone']>;

export type LeagueInput = NonNullable<SocialControllerLeagueData['query']> & {
  signal?: AbortSignal;
};
