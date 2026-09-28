import type { Achievement } from '../../../../../generated';

export type AchievementCatalogRow = Pick<Achievement, 'description' | 'descriptionEn' | 'image' | 'name' | 'order' | 'section' | 'title' | 'titleEn'>;

export type PlayerAchievementsInput = {
  counts: Record<string, number>;
  maxSeries: Record<string, number> | null | undefined;
  catalog: readonly AchievementCatalogRow[];
};

export type AchievementImages = {
  image: string | null;
  imageBig: string | null;
};
