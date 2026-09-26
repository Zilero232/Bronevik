import type { PlayerAchievement } from '@bronevik/schemas';

import { groupBy } from 'remeda';

import type { AchievementSection, AchievementSectionKey } from './achievement-sections.types';

import { ACHIEVEMENTS } from '../../config';

export const achievementSections = (items: readonly PlayerAchievement[]): AchievementSection[] =>
  Object.entries(
    groupBy(
      items.filter(({ count }) => count > 0),
      ({ section }) => section ?? ACHIEVEMENTS.fallbackSection
    )
  ).map(([section, group]) => ({ section, items: group }));

export const knownSection = (section: string): AchievementSectionKey | null => ACHIEVEMENTS.sections.find((key) => key === section) ?? null;
