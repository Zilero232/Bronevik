export type AchievementCatalogRow = {
  name: string;
  section: string | null;
  title: string;
  description: string | null;
  image: string | null;
  order: number | null;
};

export type PlayerAchievementsInput = {
  counts: Record<string, number>;
  maxSeries: Record<string, number> | null | undefined;
  catalog: readonly AchievementCatalogRow[];
};

export type AchievementImages = {
  image: string | null;
  imageBig: string | null;
};
