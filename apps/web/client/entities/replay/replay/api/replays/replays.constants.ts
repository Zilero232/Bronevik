export const REPLAY_UPLOAD_REQUEST = {
  path: '/replays',
  field: 'file',
  visibilityField: 'visibility',
  timeoutMs: 10 * 60_000
} as const;
