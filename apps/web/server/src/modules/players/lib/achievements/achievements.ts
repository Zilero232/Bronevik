import type { PlayerAchievement } from '@otmetki/schemas';

import { sortBy } from 'remeda';

import type { AchievementImages, PlayerAchievementsInput } from './achievements.types';

import { ACHIEVEMENT_IMAGE } from './achievements.constants';

export const achievementImages = (image: string | null): AchievementImages => {
  if (!image) {
    return { image: null, imageBig: null };
  }

  return image.includes(ACHIEVEMENT_IMAGE.big)
    ? { image: image.replace(ACHIEVEMENT_IMAGE.big, ACHIEVEMENT_IMAGE.small), imageBig: image }
    : { image, imageBig: image.replace(ACHIEVEMENT_IMAGE.small, ACHIEVEMENT_IMAGE.big) };
};

export const playerAchievements = ({ counts, maxSeries, catalog }: PlayerAchievementsInput): PlayerAchievement[] => {
  const byName = new Map(catalog.map((row) => [row.name, row]));

  const rows = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => {
      const row = byName.get(name);

      return {
        order: row?.order ?? Number.MAX_SAFE_INTEGER,
        item: {
          section: row?.section ?? null,
          name,
          title: row?.title ?? name,
          description: row?.description ?? null,
          ...achievementImages(row?.image ?? null),
          count,
          maxSeries: maxSeries?.[name] ?? null
        }
      };
    });

  return sortBy(
    rows,
    ({ order }) => order,
    ({ item }) => item.name
  ).map(({ item }) => item);
};
