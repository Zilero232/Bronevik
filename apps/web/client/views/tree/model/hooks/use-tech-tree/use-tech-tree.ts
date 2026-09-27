'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getTechTree } from '@/entities/tank/tree';
import { QUERY_KEYS } from '@/shared/constants';

import type { TreeContextValue } from '../../context';

import { layoutTree } from '../../../lib/tree-layout';
import { splitTree } from '../../../lib/tree-split';
import { useTreeParams } from '../use-tree-params';

export const useTechTree = () => {
  const { nation } = useTreeParams();

  return useQuery({
    queryKey: QUERY_KEYS.tree(nation),
    queryFn: ({ signal }) => getTechTree({ nation, signal }),
    placeholderData: keepPreviousData,
    select: (tree): TreeContextValue => {
      const split = splitTree(tree);

      return { ...split, layout: layoutTree({ nodes: split.tree.nodes, edges: split.tree.edges }) };
    }
  });
};
