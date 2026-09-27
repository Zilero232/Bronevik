import type { StatRow as StatRowData } from '../../../../../lib/stat-diff';

export type StatRowProps = {
  row: StatRowData;
  isCompare?: boolean;
};
