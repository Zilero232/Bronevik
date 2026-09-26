'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { getTechTree } from '@/shared/api/tree';
import { QUERY_KEYS } from '@/shared/constants';

import { layoutTree } from '../../../lib/tree-layout';
import { splitTree } from '../../../lib/tree-split';

export const useTechTree = (nation: string) => {
  const {
    data: tree,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.tree(nation),
    queryFn: ({ signal }) => getTechTree({ nation, signal }),
    placeholderData: keepPreviousData
  });

  const split = tree ? splitTree(tree) : null;
  const layout = split ? layoutTree({ nodes: split.tree.nodes, edges: split.tree.edges }) : null;

  return {
    tree: split?.tree,
    premiums: split?.premiums ?? [],
    layout,
    isLoading,
    isFetching,
    isError: isError && !isNotFoundError(error),
    isEmpty: (tree !== undefined && tree.nodes.length === 0) || isNotFoundError(error),
    refetch
  };
};
