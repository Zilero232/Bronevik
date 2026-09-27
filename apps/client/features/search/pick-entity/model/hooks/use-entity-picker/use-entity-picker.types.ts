import type { PickableKind, PickableResult } from '../../../lib/search-kind';

export type UseEntityPickerInput<K extends PickableKind> = {
  kind: K;
  excludeIds: readonly number[];
  onPick: (result: PickableResult<K>) => void;
};
