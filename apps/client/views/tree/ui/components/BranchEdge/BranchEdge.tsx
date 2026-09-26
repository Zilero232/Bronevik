'use client';

import type { EdgeProps } from '@xyflow/react';

import { EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { useFormatter } from 'next-intl';

import type { BranchFlowEdge } from '../../../lib/tree-flow';

import { TREE_FORMAT } from '../../../config';

import s from './BranchEdge.module.scss';

export const BranchEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<BranchFlowEdge>) => {
  const format = useFormatter();

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
    offset: 16
  });

  const state = data?.state ?? 'idle';
  const xp = data?.xp ?? null;

  return (
    <>
      <path className={s.path} d={path} data-state={state} fill='none' />
      {xp !== null && xp > 0 && (
        <EdgeLabelRenderer>
          <span className={s.label} data-state={state} style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}>
            {format.number(xp, TREE_FORMAT.compact)}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
