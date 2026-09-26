import type { CompareSection } from '../../../lib/compare-sections';
import type { CompareColumn } from '../../../model/hooks';

export type CompareTableProps = {
  columns: CompareColumn[];
  sections: CompareSection[];
};
