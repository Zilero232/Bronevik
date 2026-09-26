import type { Prisma } from '../../../../../generated';

export const CATALOG_ROW_SELECT = {
  name: true,
  section: true,
  title: true,
  description: true,
  image: true,
  order: true
} as const satisfies Prisma.AchievementSelect;
