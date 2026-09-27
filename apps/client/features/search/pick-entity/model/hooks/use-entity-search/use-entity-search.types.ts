import type { PickableKind } from '../../../lib/search-kind';

export type UseEntitySearchInput<K extends PickableKind> = {
  kind: K;
  query: string;
};
