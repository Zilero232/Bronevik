import type { PlayerSection } from '@/shared/constants/query-keys.types';

export type SectionFetchInput = {
  accountId: number;
  signal: AbortSignal;
};

export type UseProfileSectionInput<T> = {
  section: PlayerSection;
  params?: object;
  fetcher: (input: SectionFetchInput) => Promise<T>;
};
