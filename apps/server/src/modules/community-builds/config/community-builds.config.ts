import type { Loadout } from '@otmetki/schemas';

export const BUILD_SHARE = {
  popularLimit: 10
} as const;

export const EMPTY_LOADOUT = {
  equipment: [],
  consumables: [],
  directives: [],
  ammo: [],
  crewSkills: {},
  fieldModifications: []
} as const satisfies Loadout;
