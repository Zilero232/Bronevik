import type { REPLAY_RESULT_TONE } from '../../config';

export type ReplayResultBadgeProps = {
  result: keyof typeof REPLAY_RESULT_TONE | null;
  className?: string;
};
