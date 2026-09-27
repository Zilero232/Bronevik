import { PLUS_GRACE, PLUS_LIMITS } from '@otmetki/schemas';

export const REPLAY_OVERFLOW = {
  keep: PLUS_LIMITS.storedReplays.free,
  readOnlyDays: PLUS_GRACE.overflowReadOnlyDays,
  noticeDays: [1, 14],
  dedupePrefix: 'replay-overflow'
} as const;
