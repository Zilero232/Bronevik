import type { LucideIcon } from 'lucide-react';

import { Award, Crosshair, Medal, Shield, Sparkles } from 'lucide-react';

import type { CosmeticTone, StaticCosmeticCode } from '../model/cosmetics.types';

export const COSMETIC_TONES = {
  'banner-steel': 'steel',
  'banner-olive': 'olive',
  'banner-plus': 'plus',
  'banner-ember': 'ember',
  'banner-arctic': 'arctic',
  'banner-night': 'night',
  'frame-plus': 'plus',
  'frame-bronze': 'bronze',
  'frame-silver': 'silver',
  'frame-gold': 'gold',
  'badge-plus': 'plus',
  'badge-tanker': 'steel',
  'badge-sniper': 'arctic',
  'badge-ace': 'gold',
  'overlay-armor': 'steel',
  'overlay-hud': 'olive',
  'overlay-brass': 'bronze',
  'overlay-night': 'night'
} as const satisfies Record<StaticCosmeticCode, CosmeticTone>;

export const BADGE_ICONS = {
  'badge-plus': Sparkles,
  'badge-tanker': Shield,
  'badge-sniper': Crosshair,
  'badge-ace': Award,
  season: Medal
} as const satisfies Record<string, LucideIcon>;

export const PROFILE_COSMETICS_QUERY = {
  staleMs: 5 * 60_000
} as const;
