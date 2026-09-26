export const STREAMERS = {
  editorialEnabled: false,
  favouriteTanks: 3,
  videosLimit: 6,
  videosCacheSeconds: 900,
  liveCacheSeconds: 60,
  cachePrefix: 'otmetki:streamers:',
  removalThrottle: { limit: 3, ttl: 3_600_000 },
  claimThrottle: { limit: 10, ttl: 3_600_000 },
  modThrottle: { limit: 30, ttl: 60_000 }
} as const;

export const LIVE = {
  staleAfterMs: 5 * 60_000,
  tokenMsPerSecond: 900,
  tankWindowMs: 30 * 60_000,
  alertDedupePrefix: 'streamer-live',
  twitch: {
    helixUrl: 'https://api.twitch.tv/helix',
    batch: 100
  },
  vk: {
    apiUrl: 'https://apidev.live.vkvideo.ru',
    tokenUrl: 'https://api.live.vkvideo.ru/oauth/server/token',
    batch: 100
  },
  youtube: {
    rssUrl: 'https://www.youtube.com/feeds/videos.xml',
    apiUrl: 'https://www.googleapis.com/youtube/v3',
    pollEveryMs: 15 * 60_000
  }
} as const;

export const CLAIM = {
  codePrefix: 'otmetki-',
  codeBytes: 3,
  oauthPlatforms: ['twitch'],
  bioPlatforms: ['twitch', 'vkVideoLive', 'youtube']
} as const;

export const STREAMER_INVITATIONS = [
  { slug: 'nidin', displayName: 'NIDIN', sourceUrl: 'https://nidin.ru/game-settings', channels: [] },
  { slug: 'korben', displayName: 'Korben Dallas', sourceUrl: null, channels: [] },
  { slug: 'jove', displayName: 'Jove', sourceUrl: 'https://joves-modpack.ru/', channels: [] },
  { slug: 'protanki', displayName: 'ПРОТанки', sourceUrl: null, channels: [] },
  { slug: 'near-you', displayName: 'Near_You', sourceUrl: null, channels: [] },
  { slug: 'amway921', displayName: 'Amway921', sourceUrl: null, channels: [] },
  { slug: 'lebwa', displayName: 'Левша', sourceUrl: 'https://lebwa.tv/', channels: [] }
] as const;

export const SETTINGS_APPLY = {
  historyLimit: 20,
  expireDays: 7
} as const;

export const PROFILE_CARD_INCLUDE = {
  channels: { orderBy: { createdAt: 'asc' } },
  settings: { select: { profileId: true } }
} as const;
