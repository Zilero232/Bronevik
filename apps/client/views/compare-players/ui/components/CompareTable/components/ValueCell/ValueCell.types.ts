import type { CompareFormat } from '../../../../../config';

export type ValueCellProps = {
  value: number | null;
  format: CompareFormat;
  isBest: boolean;
};
