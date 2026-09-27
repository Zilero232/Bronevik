import type { Loadout } from '@otmetki/schemas';

import { LOADOUT, loadoutSchema } from '@otmetki/schemas';

import type { ToSlotsInput } from './loadout-code.types';

import { LOADOUT_CODE } from '../../config';

const { sectionSeparator, keySeparator, listSeparator, roleSeparator, roleAssign, skillSeparator, sections } = LOADOUT_CODE;

const slots = (values: readonly (number | null)[]) => values.map((value) => (value === null ? '' : String(value))).join(listSeparator);

const toSlots = ({ raw, size }: ToSlotsInput) =>
  Array.from({ length: size }, (_, index) => {
    const value = Number(raw?.split(listSeparator)[index]);

    return Number.isInteger(value) && value > 0 ? value : null;
  });

const toList = (raw: string | undefined) => (raw ? raw.split(listSeparator).filter(Boolean) : []);

const emptySlots = (length: number) => Array.from<number | null>({ length }).fill(null);

export const emptyLoadout = (): Loadout => ({
  equipment: emptySlots(LOADOUT.equipmentSlots),
  consumables: emptySlots(LOADOUT.consumableSlots),
  directives: emptySlots(LOADOUT.directiveSlots),
  ammo: [],
  crewSkills: {},
  fieldModifications: []
});

export const serializeLoadout = (loadout: Loadout): string => {
  const skills = Object.entries(loadout.crewSkills)
    .filter(([, ids]) => ids.length > 0)
    .map(([role, ids]) => `${role}${roleAssign}${ids.join(skillSeparator)}`)
    .join(roleSeparator);

  return [
    [sections.modules, loadout.profileId ?? ''],
    [sections.equipment, slots(loadout.equipment)],
    [sections.consumables, slots(loadout.consumables)],
    [sections.directives, slots(loadout.directives)],
    [sections.skills, skills],
    [sections.fieldMods, loadout.fieldModifications.join(listSeparator)]
  ]
    .map(([key, value]) => `${key}${keySeparator}${value}`)
    .join(sectionSeparator);
};

export const parseLoadout = (code: string): Loadout | null => {
  const parts = new Map(
    code.split(sectionSeparator).map((part) => {
      const index = part.indexOf(keySeparator);

      return [part.slice(0, index), part.slice(index + 1)] as const;
    })
  );

  const crewSkills = Object.fromEntries(
    toList(parts.get(sections.skills)?.replaceAll(roleSeparator, listSeparator)).map((entry) => {
      const [role = '', ids = ''] = entry.split(roleAssign);

      return [role, ids.split(skillSeparator).filter(Boolean)];
    })
  );

  const result = loadoutSchema.safeParse({
    profileId: parts.get(sections.modules) || undefined,
    equipment: toSlots({ raw: parts.get(sections.equipment), size: LOADOUT.equipmentSlots }),
    consumables: toSlots({ raw: parts.get(sections.consumables), size: LOADOUT.consumableSlots }),
    directives: toSlots({ raw: parts.get(sections.directives), size: LOADOUT.directiveSlots }),
    ammo: [],
    crewSkills,
    fieldModifications: toList(parts.get(sections.fieldMods))
  });

  return result.success ? result.data : null;
};
