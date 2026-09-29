import { Send } from 'lucide-react';

import { TELEGRAM_BOT } from '@/shared/config';

import type { PromoId } from './promo-items.constants';

export const PROMO_BOARD = {
  hero: ['modpack', 'marksPanel', 'plus', 'teamHp', 'damageLog', 'crosshair', 'gear', 'hits'],
  tiles: [
    ['armor', 'builds'],
    ['marks', 'ratings'],
    ['play', 'tournaments', 'streamers']
  ],
  showcase: ['marksPanel', 'teamHp', 'damageLog', 'crosshair', 'gear', 'hits']
} as const satisfies { hero: readonly PromoId[]; tiles: readonly (readonly PromoId[])[]; showcase: readonly PromoId[] };

export const PROMO_CAROUSEL = {
  heroDelay: 7000,
  tileDelay: 8000,
  tileStagger: 1700,
  duration: 30
} as const;

export const PROMO_TANKS = { period: '7d', sort: 'battles', order: 'desc', limit: 10 } as const;

export const PROMO_SOCIAL = [{ id: 'telegram', href: TELEGRAM_BOT.url, icon: Send }] as const;

export const PROMO_ICON = {
  arrow: 16,
  control: 16,
  social: 18,
  emblemHero: 132,
  emblemTile: 72,
  placeholder: 160,
  mock: 14,
  mockSide: 16
} as const;
