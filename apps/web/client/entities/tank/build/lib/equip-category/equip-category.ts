import { isIncludedIn } from 'remeda';

import type { EquipTileCategory } from './equip-category.types';

import { EQUIP_TILE } from '../../config';

export const equipCategory = (variant: string | null | undefined): EquipTileCategory =>
  variant && isIncludedIn(variant, EQUIP_TILE.categories) ? variant : 'standard';
