import type { Tier } from '@bronevik/icons';

import { TIERS } from '@bronevik/icons';

import type { PlayerTanksFilter } from '@/shared/api/players';

import type { MatchesTankQueryInput, TanksFilterState } from './tanks-filter.types';

const normalize = (value: string) => value.toLocaleLowerCase('ru').replaceAll(/[\s\-.]/g, '');

export const tiersOf = (values: readonly string[]): Tier[] => TIERS.filter((tier) => values.includes(String(tier)));

export const matchesTankQuery = ({ name, query }: MatchesTankQueryInput) => normalize(name).includes(normalize(query));

export const tanksRequest = ({ tiers, types, nation, premium }: TanksFilterState): PlayerTanksFilter => ({
  tiers,
  types,
  nations: nation === 'all' ? [] : [nation],
  premium: premium === 'all' ? undefined : premium === 'premium'
});
