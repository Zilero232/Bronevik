import type { SearchResult } from '@otmetki/schemas';

import type { PickableKind, PickableResult } from '../../model/hooks/use-entity-search';

export const isKind =
  <K extends PickableKind>(kind: K) =>
  (result: SearchResult): result is PickableResult<K> & SearchResult =>
    result.kind === kind;
