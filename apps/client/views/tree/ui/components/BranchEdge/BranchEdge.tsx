'use client';

import type { EdgeProps } from '@xyflow/react';

import { EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { motion } from 'motion/react';
import { useFormatter } from 'next-intl';

import type { BranchFlowEdge } from '../../../lib/tree-flow';

import { EDGE_DRAW, edgeTransition, LABEL_ENTER } from './BranchEdge.motion';

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
    borderRadius: 12,
    offset: 20
  });

  const state = data?.state ?? 'idle';
  const delay = data?.delay ?? 0;
  const xp = data?.xp ?? null;

  return (
    <>
      <motion.path {...EDGE_DRAW} className={s.path} d={path} data-state={state} fill='none' transition={edgeTransition(delay)} />
      {state === 'path' && <path className={s.flow} d={path} fill='none' />}
      {xp !== null && xp > 0 && (
        <EdgeLabelRenderer>
          <motion.span
            {...LABEL_ENTER}
            className={s.label}
            data-state={state}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            transition={edgeTransition(delay + 0.3)}
          >
            {format.number(xp, { notation: 'compact', maximumFractionDigits: 1 })}
          </motion.span>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
