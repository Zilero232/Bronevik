'use client';

import { useTechTree } from '../use-tech-tree';
import { useTreeParams } from '../use-tree-params';

export const useTreeExplorer = () => {
  const { nation } = useTreeParams();

  return useTechTree(nation);
};
