export const PROFILE_FORM = {
  noAccount: 'none',
  linkProtocol: /^https?$/u,
  slugTakenStatus: 409,
  invalidCode: 'VALIDATION_FAILED',
  hostIssue: 'channelHost'
} as const;

export const CHANNEL_HOSTS = {
  twitch: ['twitch.tv', 'www.twitch.tv', 'm.twitch.tv'],
  vkVideoLive: ['live.vkvideo.ru', 'vkplay.live', 'live.vkplay.ru'],
  youtube: ['youtube.com', 'www.youtube.com', 'm.youtube.com'],
  trovo: ['trovo.live', 'www.trovo.live'],
  telegram: ['t.me', 'telegram.me'],
  boosty: ['boosty.to', 'www.boosty.to'],
  vk: ['vk.com', 'www.vk.com', 'm.vk.com', 'vk.ru']
} as const;
