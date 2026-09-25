export const STREAMER_PROFILE = {
  slugPattern: /^[a-z0-9][a-z0-9-]{2,31}$/u,
  publicIdPattern: /^[\da-f]{32}$/u,
  bioMaxLength: 500,
  displayNameMaxLength: 64
} as const;

export const STREAMERS_PATHS = {
  profile: '/streamers/me',
  bySlug: (slug: string) => `/streamers/${encodeURIComponent(slug)}`,
  overlays: '/streamers/me/overlays',
  overlay: (id: string) => `/streamers/me/overlays/${id}`,
  challenges: '/streamers/me/challenges',
  activate: (id: string) => `/streamers/me/challenges/${id}/activate`,
  cancel: (id: string) => `/streamers/me/challenges/${id}/cancel`,
  integrations: '/streamers/me/integrations',
  connect: (provider: string) => `/streamers/me/integrations/${provider}/connect`,
  integration: (provider: string) => `/streamers/me/integrations/${provider}`,
  overlayData: (publicId: string) => `/overlays/${publicId}`,
  overlayStream: (publicId: string) => `/overlays/${publicId}/stream`
} as const;

export const PROVIDER_PATH = {
  donationAlerts: 'donation-alerts',
  twitch: 'twitch'
} as const;

export const PROVIDER_FROM_PATH = {
  'donation-alerts': 'donationAlerts',
  twitch: 'twitch'
} as const;
