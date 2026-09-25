import type { SearchResult } from '@bronevik/schemas';

import type { SearchGroups } from './group-results.types';

export const groupSearchResults = (results: SearchResult[]): SearchGroups => ({
  players: results.filter((result) => result.kind === 'player'),
  tanks: results.filter((result) => result.kind === 'tank'),
  clans: results.filter((result) => result.kind === 'clan')
});

export const countSearchGroups = ({ players, tanks, clans }: SearchGroups) => players.length + tanks.length + clans.length;
