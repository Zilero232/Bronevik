import type { ModBattleLoadout } from '@otmetki/schemas';

import type { StoredLoadout } from './loadout.types';

import { storedLoadoutSchema } from './loadout.schemas';

export const toStoredLoadout = (loadout: ModBattleLoadout): StoredLoadout => ({
  optionalDevices: loadout.optional_devices,
  consumables: loadout.consumables,
  directives: loadout.directives,
  shells: loadout.shells.map((shell) => ({ shellId: shell.shell_id, count: shell.count })),
  fieldModifications: loadout.field_modifications,
  crew: loadout.crew.map((member) => ({ role: member.role, skills: member.skills })),
  gameplayId: loadout.gameplay_id
});

export const readStoredLoadout = (value: unknown): StoredLoadout | null => {
  const parsed = storedLoadoutSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};
