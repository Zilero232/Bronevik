import type { ReplayMinimum } from '../../../lib/replay-query';

export type MinimumChange = {
  key: ReplayMinimum;
  value: number | null;
};
