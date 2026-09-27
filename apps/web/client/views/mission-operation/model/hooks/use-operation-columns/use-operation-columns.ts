'use client';

import { operationColumns, operationTotals } from '../../../lib/operation-board';
import { useBranchLabel } from '../use-branch-label';
import { useMissionProgress } from '../use-mission-progress';
import { useOperationDetail } from '../use-operation-detail';

export const useOperationColumns = () => {
  const { data } = useOperationDetail();
  const { items, isSignedIn, isTracked } = useMissionProgress();
  const label = useBranchLabel();

  const columns = operationColumns({ branches: data?.branches ?? [], progress: items, isTracked, label });

  return { columns, totals: isSignedIn ? operationTotals(columns) : null };
};
