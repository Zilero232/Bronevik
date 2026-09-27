'use client';

import { getSmoothStepPath } from '@xyflow/react';
import { useFormatter } from 'next-intl';

import type { UseBranchEdgeInput } from './use-branch-edge.types';

import { TREE_EDGE, TREE_FORMAT } from '../../../config';

export const useBranchEdge = ({ data, ...geometry }: UseBranchEdgeInput) => {
  const format = useFormatter();

  const [path, labelX, labelY] = getSmoothStepPath({ ...geometry, ...TREE_EDGE.path });
  const xp = data?.xp ?? null;

  return {
    path,
    state: data?.state ?? 'idle',
    xpLabel: xp !== null && xp > 0 ? format.number(xp, TREE_FORMAT.compact) : null,
    labelTransform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
  };
};
