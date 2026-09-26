export const REPLAY_VISIBILITIES = ['public', 'unlisted', 'private'] as const;

export const REPLAY_UPLOAD = {
  maxBytes: 50 * 1024 * 1024,
  extensions: ['.mtreplay', '.wotreplay'],
  accept: '.mtreplay,.wotreplay',
  defaultVisibility: 'public',
  pollIntervalMs: 2000,
  bytesPerMegabyte: 1024 * 1024
} as const;

export const SETTLED_REPLAY_STATUSES = ['parsed', 'failed'] as const;
