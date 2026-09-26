import { DATA_TABLE } from '../../DataTable.constants';

export const DATA_TABLE_SKELETON = {
  rows: Array.from({ length: DATA_TABLE.skeletonRows }, (_, index) => index)
} as const;
