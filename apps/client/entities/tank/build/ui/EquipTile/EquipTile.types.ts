import type { EquipTileCategory } from '../../lib/equip-category';
import type { GameIconKind } from '../GameIcon';

export type EquipTileProps = {
  name: string | null;
  image: string | null;
  kind?: GameIconKind;
  category?: 'consumable' | 'directive' | EquipTileCategory;
  size?: 'md' | 'sm' | 'xs';
  share?: number | null;
  isImproved?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  className?: string;
};
