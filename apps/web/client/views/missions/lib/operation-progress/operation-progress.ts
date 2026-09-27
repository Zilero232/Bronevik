import type { OperationProgress, OperationProgressInput } from './operation-progress.types';

export const operationProgress = ({ questIds, items }: OperationProgressInput): OperationProgress => {
  const ids = new Set(questIds);
  const own = items.filter((item) => ids.has(item.questId));

  return {
    total: ids.size,
    done: own.filter((item) => item.done).length,
    honors: own.filter((item) => item.honors).length
  };
};
