import type { SocialControllerYearWrappedData, Wrapped } from '@/shared/api/generated';

export type PlayerWrapped = Wrapped;

export type PlayerWrappedTank = Wrapped['topTanks'][number];

export type PlayerWrappedBattle = NonNullable<Wrapped['bestBattle']>;

export type PlayerWrappedInput = {
  accountId: SocialControllerYearWrappedData['path']['id'];
  year: number;
  signal?: AbortSignal;
};
