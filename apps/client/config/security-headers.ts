export const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
];

// Later rules win over the site-wide DENY above. Browsers that see a CSP
// frame-ancestors ignore X-Frame-Options, so the CSP is the policy that counts.
const frameable = (ancestors: string) => [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: `frame-ancestors ${ancestors}` }
];

const localized = (path: string) => [path, `/en${path}`];

export const FRAMEABLE_HEADER_RULES = [
  // Stream overlays are previewed inside the streamer dashboard.
  ...localized('/overlay/:path*').map((source) => ({ source, headers: frameable("'self'") })),
  // Telegram Web (web.telegram.org) opens the Mini App in an iframe.
  ...localized('/tg/:path*').map((source) => ({ source, headers: frameable("'self' https://web.telegram.org") })),
  // VK web opens the Mini App in an iframe on vk.com / vk.ru.
  ...localized('/vk/:path*').map((source) => ({
    source,
    headers: frameable("'self' https://vk.com https://*.vk.com https://vk.ru https://*.vk.ru")
  })),
  // The Twitch panel extension renders inside twitch.tv (hosted test) or the ext-twitch.tv CDN frame.
  { source: '/twitch-panel', headers: frameable("'self' https://*.twitch.tv https://*.ext-twitch.tv") }
];
