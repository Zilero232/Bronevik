export const PROFILE_FORM = {
  noAccount: 'none',
  linkProtocol: /^https?$/u,
  slugTakenCode: 'STREAMER_SLUG_TAKEN',
  channelTakenCode: 'STREAMER_CHANNEL_TAKEN',
  invalidCode: 'VALIDATION_FAILED',
  hostIssue: 'channelHost'
} as const;
