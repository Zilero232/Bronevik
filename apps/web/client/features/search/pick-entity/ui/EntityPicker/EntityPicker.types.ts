import type { PickableKind, PickableResult } from '../../lib/search-kind';

export type EntityPickerProps<K extends PickableKind> = {
  kind: K;
  placeholder: string;
  excludeIds?: readonly number[];
  size?: 'lg' | 'md';
  isDisabled?: boolean;
  className?: string;
  onPick: (result: PickableResult<K>) => void;
};
