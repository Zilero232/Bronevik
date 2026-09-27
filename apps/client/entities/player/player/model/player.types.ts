import type { PlayerSummary } from '@otmetki/schemas';

export type PlayerIdentityData = Pick<PlayerSummary, 'nickname'> & {
  clanTag: NonNullable<PlayerSummary['clan']>['tag'] | null;
};
