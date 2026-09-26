import type { MeSection } from '@/shared/constants';

export type UseMeSectionInput<T> = {
  section: MeSection;
  fetcher: () => Promise<T>;
};
