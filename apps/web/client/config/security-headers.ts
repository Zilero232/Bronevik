import type { CspInput, Directives, FrameableInput, PolicyInput } from './security-headers.types';

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
];

// Next inlines its bootstrap and flight-data scripts. A nonce would force every
// page to render dynamically, which cacheComponents prerendering rules out, so
// scripts are pinned to our own origin plus the few third parties we load.
const apiOrigins = (apiUrl: string | undefined) => {
  if (!apiUrl) {
    return [];
  }

  const url = new URL(apiUrl);
  const socket = new URL(url.origin);

  socket.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

  return [url.origin, socket.origin];
};

const baseDirectives = ({ apiUrl, isDev }: CspInput): Directives => ({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
  'style-src': ["'self'", "'unsafe-inline'"],
  // In development the API is served over plain http (the /sig/*.png signatures and
  // uploads), which the site-wide https: source does not cover.
  'img-src': ["'self'", 'data:', 'blob:', 'https:', ...(isDev ? apiOrigins(apiUrl).slice(0, 1) : [])],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", ...apiOrigins(apiUrl), ...(isDev ? ['ws:'] : [])],
  'media-src': ["'self'", 'blob:'],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'frame-src': ["'self'"],
  'form-action': ["'self'", ...apiOrigins(apiUrl).slice(0, 1)],
  'object-src': ["'none'"],
  'base-uri': ["'none'"],
  'frame-ancestors': ["'none'"]
});

const policy = ({ extra = {}, ...input }: PolicyInput) => {
  const directives = baseDirectives(input);

  for (const [name, sources] of Object.entries(extra)) {
    directives[name] = name === 'frame-ancestors' ? sources : [...(directives[name] ?? []), ...sources];
  }

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
};

const csp = (input: PolicyInput) => ({ key: 'Content-Security-Policy', value: policy(input) });

const localized = (path: string) => [path, `/en${path}`];

// The Telegram login widget loads from telegram.org, renders its button in an
// oauth.telegram.org frame and runs the data-onauth handler through `new Function`.
const TELEGRAM_WIDGET: Directives = {
  'script-src': ['https://telegram.org', "'unsafe-eval'"],
  'frame-src': ['https://oauth.telegram.org']
};

// Later rules win over the site-wide policy. Browsers that see a CSP
// frame-ancestors ignore X-Frame-Options, so the CSP is the policy that counts.
const frameable = ({ ancestors, ...input }: FrameableInput) => [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  csp({ ...input, extra: { ...input.extra, 'frame-ancestors': ancestors } })
];

export const securityHeaderRules = (input: CspInput) => [
  { source: '/:path*', headers: [...SECURITY_HEADERS, csp(input)] },
  ...localized('/login').map((source) => ({ source, headers: [csp({ ...input, extra: TELEGRAM_WIDGET })] })),
  // Stream overlays are previewed inside the streamer dashboard.
  ...localized('/overlay/:path*').map((source) => ({ source, headers: frameable({ ...input, ancestors: ["'self'"] }) })),
  // Telegram Web (web.telegram.org) opens the Mini App in an iframe.
  ...localized('/tg/:path*').map((source) => ({ source, headers: frameable({ ...input, ancestors: ["'self'", 'https://web.telegram.org'] }) })),
  // VK web opens the Mini App in an iframe on vk.com / vk.ru.
  ...localized('/vk/:path*').map((source) => ({
    source,
    headers: frameable({ ...input, ancestors: ["'self'", 'https://vk.com', 'https://*.vk.com', 'https://vk.ru', 'https://*.vk.ru'] })
  })),
  // The Twitch panel extension renders inside twitch.tv (hosted test) or the ext-twitch.tv CDN frame
  // and loads the extension helper from Twitch's CDN.
  {
    source: '/twitch-panel{/}?',
    headers: frameable({
      ...input,
      ancestors: ["'self'", 'https://*.twitch.tv', 'https://*.ext-twitch.tv'],
      extra: { 'script-src': ['https://extension-files.twitch.tv'] }
    })
  }
];
