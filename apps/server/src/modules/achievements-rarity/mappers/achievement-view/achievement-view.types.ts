import type { AchievementRarity } from '../../../../../generated';
import type { CatalogRow } from '../../achievements-rarity.types';

export type RarityRow = Pick<AchievementRarity, 'holders' | 'name' | 'points' | 'share'>;

export type AchievementItemInput = {
  row: CatalogRow;
  rarity: RarityRow | undefined;
};
