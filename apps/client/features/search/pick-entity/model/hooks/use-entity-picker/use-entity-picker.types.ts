import type { PickableKind, PickableResult } from '../use-entity-search';

export type UseEntityPickerInput<K extends PickableKind> = {
  kind: K;
  excludeIds: readonly number[];
  onPick: (result: PickableResult<K>) => void;
};
