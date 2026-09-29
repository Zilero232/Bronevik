import type { Prisma } from '../../../../../generated';

export const RARITY_ROW_SELECT = {
  name: true,
  holders: true,
  points: true,
  share: true,
  sample: true,
  computedAt: true
} as const satisfies Prisma.AchievementRaritySelect;
