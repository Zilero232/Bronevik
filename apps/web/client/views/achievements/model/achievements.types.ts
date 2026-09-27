import type { AchievementsCatalog, Collectors, TankRarity } from '@/shared/api/generated';

import type { ACHIEVEMENTS_TABS } from '../config';

export type AchievementsTab = (typeof ACHIEVEMENTS_TABS)[number];

export type MedalRow = AchievementsCatalog['items'][number];

export type TankRarityRow = TankRarity['items'][number];

export type CollectorRow = Collectors['items'][number];

export type RarityTier = TankRarityRow['tier'];
