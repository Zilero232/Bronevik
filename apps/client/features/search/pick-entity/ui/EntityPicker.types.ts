import type { PickableKind, PickableResult } from '../model/hooks';

export type EntityPickerProps<K extends PickableKind> = {
  kind: K;
  placeholder: string;
  excludeIds?: number[];
  size?: 'lg' | 'md';
  isDisabled?: boolean;
  className?: string;
  onPick: (result: PickableResult<K>) => void;
};
