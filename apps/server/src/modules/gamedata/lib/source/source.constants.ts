export const GAME_DATA_SOURCES = {
  RU: { id: 'RU', owner: 'unicum-gg', repo: 'wot.src', ref: 'RU', isTest: false },
  PT_RU: { id: 'PT_RU', owner: 'unicum-gg', repo: 'wot.src', ref: 'PT_RU', isTest: true },
  IZEBERG_RU: { id: 'IZEBERG_RU', owner: 'izeberg', repo: 'wot-src', ref: 'RU', isTest: false }
} as const;

export const MINIMAP_SOURCES = {
  RU: { owner: 'unicum-gg', repo: 'wot.maps', ref: 'Lesta' },
  PT_RU: { owner: 'unicum-gg', repo: 'wot.maps', ref: 'Lesta_PT' },
  IZEBERG_RU: { owner: 'unicum-gg', repo: 'wot.maps', ref: 'Lesta' }
} as const;

export const MODEL_SOURCES = {
  RU: { owner: 'unicum-gg', repo: 'wot.models', ref: 'Lesta', isTest: false }
} as const;

export const MODEL_PATHS = {
  version: '.version_name',
  index: 'vehicles.json',
  vehicles: 'vehicles',
  collision: 'collision.json'
} as const;

export const GITHUB = {
  api: 'https://api.github.com',
  raw: 'https://raw.githubusercontent.com',
  apiVersion: '2022-11-28',
  userAgent: 'otmetki-gamedata'
} as const;

export const FETCH = {
  concurrency: 16,
  retries: 4,
  retryDelayMs: 1000,
  notFoundMarker: '.404'
} as const;

export const GAME_PATHS = {
  version: '.version_name',
  vehicles: 'sources/res/scripts/item_defs/vehicles',
  common: 'sources/res/scripts/item_defs/vehicles/common',
  postProgression: 'sources/res/scripts/item_defs/vehicles/common/post_progression',
  perks: 'sources/res/scripts/item_defs/perks/perks.xml',
  tankmen: 'sources/res/scripts/item_defs/tankmen/tankmen.xml',
  arenas: 'sources/res/scripts/arena_defs'
} as const;
