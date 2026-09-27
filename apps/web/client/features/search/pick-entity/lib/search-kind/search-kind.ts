import type { SearchResult } from '@otmetki/schemas';

import type { PickableKind, PickableResult } from './search-kind.types';

export const isKind =
  <K extends PickableKind>(kind: K) =>
  (result: SearchResult): result is PickableResult<K> & SearchResult =>
    result.kind === kind;
