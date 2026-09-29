import type { LucideIcon } from 'lucide-react';

import { Cog, GraduationCap, Package, ScrollText, SlidersHorizontal } from 'lucide-react';

export const GAME_ICON_FALLBACK = {
  optionalDevice: Cog,
  consumable: Package,
  directive: ScrollText,
  fieldModification: SlidersHorizontal,
  skill: GraduationCap
} as const satisfies Record<string, LucideIcon>;

export const GAME_ICON = {
  glyphRatio: 0.6,
  strokeWidth: 1.75
} as const;
