import type { MeSection } from '@/shared/constants/query-keys.types';

export type UseMeSectionInput<T> = {
  section: MeSection;
  fetcher: () => Promise<T>;
};
