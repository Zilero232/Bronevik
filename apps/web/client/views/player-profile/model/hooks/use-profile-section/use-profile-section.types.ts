import type { PlayerSection } from '@/shared/constants';

type SectionFetchInput = {
  accountId: number;
  signal: AbortSignal;
};

export type UseProfileSectionInput<T> = {
  section: PlayerSection;
  params?: object;
  fetcher: (input: SectionFetchInput) => Promise<T>;
};
