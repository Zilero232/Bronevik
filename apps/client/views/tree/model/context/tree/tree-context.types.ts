import type { TreeLayout } from '../../../lib/tree-layout';
import type { TreeSplit } from '../../../lib/tree-split';

export type TreeContextValue = TreeSplit & {
  layout: TreeLayout;
};
