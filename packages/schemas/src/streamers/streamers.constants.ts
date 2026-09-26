export const STREAMER_PROFILE = {
  slugPattern: /^[a-z0-9][a-z0-9-]{2,31}$/u,
  publicIdPattern: /^[\da-f]{32}$/u,
  bioMaxLength: 500,
  displayNameMaxLength: 64
} as const;
