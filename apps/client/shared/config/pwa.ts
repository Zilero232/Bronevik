export const PWA_ICONS = [
  { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
  { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
] as const;

export const PWA = {
  startUrl: '/',
  display: 'standalone',
  icon: '/icons/icon-192.png',
  badge: '/icons/maskable-192.png',
  categories: ['games', 'entertainment', 'utilities']
} as const;
