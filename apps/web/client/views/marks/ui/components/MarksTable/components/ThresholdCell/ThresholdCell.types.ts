import type { MarkCount } from '@otmetki/icons';

export type ThresholdCellProps = {
  value: number | null;
  marks?: MarkCount | null;
  isKey?: boolean;
};
