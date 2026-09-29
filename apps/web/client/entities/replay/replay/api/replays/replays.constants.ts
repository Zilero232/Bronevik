import { minutesToMilliseconds } from 'date-fns';

export const REPLAY_UPLOAD_REQUEST = {
  path: '/replays',
  field: 'file',
  visibilityField: 'visibility',
  timeoutMs: minutesToMilliseconds(10)
} as const;
