import type { SearchResponse } from '@otmetki/schemas';

export type UseDebouncedSearchInput<T> = {
  query: string;
  select?: (response: SearchResponse) => T;
};
