import type { EquipTileCategory } from './equip-category.types';

import { EQUIP_TILE } from '../../config';

const CATEGORIES: readonly string[] = EQUIP_TILE.categories;

const isCategory = (variant: string): variant is EquipTileCategory => CATEGORIES.includes(variant);

export const equipCategory = (variant: string | null | undefined): EquipTileCategory => (variant && isCategory(variant) ? variant : 'standard');

export const isImprovedVariant = (variant: string | null | undefined): boolean => equipCategory(variant) !== 'standard';
