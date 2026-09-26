import type { MissionOperation } from '@otmetki/schemas';

export type OperationHeaderProps = {
  data: MissionOperation;
  totals: { done: number; honors: number } | null;
};
