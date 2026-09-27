import type { MissionOperationSummary } from '@otmetki/schemas';

import type { OperationProgress } from '../../../lib/operation-progress';

export type OperationCardProps = {
  operation: MissionOperationSummary;
  progress: OperationProgress | null;
};
