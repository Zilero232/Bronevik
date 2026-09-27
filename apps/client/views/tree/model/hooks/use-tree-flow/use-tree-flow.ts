'use client';

import { toFlowElements } from '../../../lib/tree-flow';
import { useTree } from '../../context';
import { usePathSelection } from '../use-path-selection';

export const useTreeFlow = () => {
  const { tree, layout } = useTree();
  const { path, onClear } = usePathSelection();

  return { nation: tree.nation, ...toFlowElements({ tree, layout, path }), onClear };
};
