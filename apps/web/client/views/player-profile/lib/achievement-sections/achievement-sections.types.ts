import type { PlayerAchievement } from '@otmetki/schemas';

import type { ACHIEVEMENTS } from '../../config';

export type AchievementSection = {
  section: string;
  items: PlayerAchievement[];
};

export type AchievementSectionKey = (typeof ACHIEVEMENTS.sections)[number];
