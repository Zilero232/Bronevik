import type { Loadout } from '@otmetki/schemas';

export const EMPTY_LOADOUT = {
  equipment: [],
  consumables: [],
  directives: [],
  ammo: [],
  crewSkills: {},
  fieldModifications: []
} as const satisfies Loadout;
