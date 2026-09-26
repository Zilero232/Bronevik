export const STREAMER_PROFILE = {
  slugPattern: /^[a-z0-9][a-z0-9-]{2,31}$/u,
  publicIdPattern: /^[\da-f]{32}$/u,
  bioMaxLength: 500,
  displayNameMaxLength: 64,
  channelsMax: 10
} as const;

export const OVERLAY_THEMES = {
  standard: ['steel', 'tracer', 'minimal', 'transparent'],
  premium: ['armor', 'hud', 'brass', 'night'],
  fallback: 'steel'
} as const;

export const STREAMER_PLATFORMS = ['twitch', 'vkVideoLive', 'youtube', 'trovo', 'telegram', 'boosty', 'vk'] as const;

export const STREAMER_DIRECTORY = {
  defaultLimit: 24,
  maxLimit: 60
} as const;
