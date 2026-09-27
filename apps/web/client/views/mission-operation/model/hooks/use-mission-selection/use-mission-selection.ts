'use client';

import { useQueryStates } from 'nuqs';

import { MISSION_PARAMS } from '../../../config';
import { selectedNode } from '../../../lib/operation-board';
import { useOperationColumns } from '../use-operation-columns';

export const useMissionSelection = () => {
  const [{ mission: questId }, setParams] = useQueryStates(MISSION_PARAMS, { history: 'replace', scroll: false });
  const { columns } = useOperationColumns();

  const mission = selectedNode({ columns, questId })?.mission ?? null;

  return {
    mission,
    selectedId: mission?.questId ?? null,
    select: (next: number) => void setParams({ mission: next })
  };
};
