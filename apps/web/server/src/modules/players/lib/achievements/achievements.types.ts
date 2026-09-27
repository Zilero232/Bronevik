import type { Achievement } from '../../../../../generated';

export type AchievementCatalogRow = Pick<Achievement, 'description' | 'image' | 'name' | 'order' | 'section' | 'title'>;

export type PlayerAchievementsInput = {
  counts: Record<string, number>;
  maxSeries: Record<string, number> | null | undefined;
  catalog: readonly AchievementCatalogRow[];
};

export type AchievementImages = {
  image: string | null;
  imageBig: string | null;
};
