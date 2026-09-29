import type { DailyStatus } from '../../../../lib/daily-status';

export type PuzzleStatusProps = {
  status: DailyStatus | null;
  clock: string | null;
};
