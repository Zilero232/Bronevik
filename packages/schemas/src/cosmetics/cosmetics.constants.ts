export const COSMETIC_SLOTS = ['badge', 'frame', 'banner', 'overlayTheme'] as const;

export const PROFILE_COSMETIC_SLOTS = ['badge', 'frame', 'banner'] as const;

export const COSMETIC_SOURCES = ['default', 'plus', 'shop', 'season'] as const;

export const COSMETIC_GRADES = ['bronze', 'silver', 'gold'] as const;

export const COSMETIC_ITEMS = [
  { code: 'banner-steel', slot: 'banner', source: 'default', price: null },
  { code: 'banner-olive', slot: 'banner', source: 'default', price: null },
  { code: 'banner-plus', slot: 'banner', source: 'plus', price: null },
  { code: 'banner-ember', slot: 'banner', source: 'shop', price: 150 },
  { code: 'banner-arctic', slot: 'banner', source: 'shop', price: 150 },
  { code: 'banner-night', slot: 'banner', source: 'shop', price: 250 },
  { code: 'frame-plus', slot: 'frame', source: 'plus', price: null },
  { code: 'frame-bronze', slot: 'frame', source: 'shop', price: 200 },
  { code: 'frame-silver', slot: 'frame', source: 'shop', price: 400 },
  { code: 'frame-gold', slot: 'frame', source: 'shop', price: 800 },
  { code: 'badge-plus', slot: 'badge', source: 'plus', price: null },
  { code: 'badge-tanker', slot: 'badge', source: 'shop', price: 100 },
  { code: 'badge-sniper', slot: 'badge', source: 'shop', price: 250 },
  { code: 'badge-ace', slot: 'badge', source: 'shop', price: 500 },
  { code: 'overlay-armor', slot: 'overlayTheme', source: 'plus', price: null },
  { code: 'overlay-hud', slot: 'overlayTheme', source: 'plus', price: null },
  { code: 'overlay-brass', slot: 'overlayTheme', source: 'shop', price: 300 },
  { code: 'overlay-night', slot: 'overlayTheme', source: 'shop', price: 300 }
] as const;

export const COSMETIC_CODE = {
  pattern: /^[a-z0-9-]{3,48}$/u,
  seasonPattern: /^season-(\d{4}-q[1-4])-(badge|frame|banner)-(bronze|silver|gold)$/u,
  overlayPrefix: 'overlay-'
} as const;

export const PROFILE_COSMETICS = {
  maxBatch: 100
} as const;
