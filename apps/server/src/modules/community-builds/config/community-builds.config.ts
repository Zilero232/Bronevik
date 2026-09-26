import type { Loadout } from '@bronevik/schemas';

import { AUTHOR_SELECT } from '../../community-core';

export const BUILD_SHARE = {
  popularLimit: 10
} as const;

export const BUILD_INCLUDE = { author: { select: AUTHOR_SELECT }, gameVersion: { select: { version: true } } } as const;

export const EMPTY_LOADOUT: Loadout = { equipment: [], consumables: [], directives: [], ammo: [], crewSkills: {}, fieldModifications: [] };
