'use client';

import type { EdgeProps } from '@xyflow/react';

import { EdgeLabelRenderer } from '@xyflow/react';

import type { BranchFlowEdge } from '../../../lib/tree-flow';

import { useBranchEdge } from '../../../model/hooks';

import s from './BranchEdge.module.scss';

export const BranchEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<BranchFlowEdge>) => {
  const { path, state, xpLabel, labelTransform } = useBranchEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data });

  return (
    <>
      <path className={s.path} d={path} data-state={state} fill='none' />
      {xpLabel && (
        <EdgeLabelRenderer>
          <span className={s.label} data-state={state} style={{ transform: labelTransform }}>
            {xpLabel}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
