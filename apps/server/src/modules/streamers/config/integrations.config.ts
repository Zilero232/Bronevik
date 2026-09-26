export const DONATION_ALERTS = {
  authorizeUrl: 'https://www.donationalerts.com/oauth/authorize',
  scopes: ['oauth-user-show', 'oauth-donation-subscribe', 'oauth-donation-index'],
  callbackPath: '/streamers/integrations/donation-alerts/callback'
} as const;

export const TWITCH = {
  authorizeUrl: 'https://id.twitch.tv/oauth2/authorize',
  scopes: ['chat:read', 'chat:edit'],
  callbackPath: '/streamers/integrations/twitch/callback',
  intentPrefix: 'chat:'
} as const;

export const OAUTH_STATE = {
  prefix: 'otmetki:streamers:oauth:',
  ttlSeconds: 600,
  bytes: 24
} as const;

export const INTEGRATIONS = {
  syncIntervalMs: 5 * 60_000,
  doneRedirectPath: '/me/streamer?streamer=connected',
  failedRedirectPath: '/me/streamer?streamer=failed'
} as const;

export const NO_SCOPES = [] as const satisfies readonly string[];

export const PROVIDER_FROM_PATH = {
  'donation-alerts': 'donationAlerts',
  twitch: 'twitch'
} as const;
