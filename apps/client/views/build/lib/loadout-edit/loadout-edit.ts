import type { Loadout, LoadoutRequest } from '@bronevik/schemas';

import { sortBy } from 'remeda';

import { serializeLoadout } from '@/entities/tank/build';

import type { BuildModule } from '../build-catalog';
import type {
  ChooseFieldModInput,
  FieldModSide,
  FieldModSideInput,
  LoadoutRequestInput,
  ModuleSelection,
  ModulesInput,
  RoleSkillsInput,
  SameLoadoutInput,
  SetModuleInput,
  SetSlotItemInput,
  SlotModulesInput,
  SlotsOfInput,
  TakenIdsInput,
  ToggleSkillInput
} from './loadout-edit.types';

import { LOADOUT_REQUEST, MODULE_ORDER, MODULE_SLOTS, SLOT_SIZES } from './loadout-edit.constants';

export const slotsOf = ({ loadout, field }: SlotsOfInput): (number | null)[] =>
  Array.from({ length: SLOT_SIZES[field] }, (_, index) => loadout[field][index] ?? null);

export const setSlotItem = ({ loadout, field, slot, id }: SetSlotItemInput): Loadout => {
  const next = slotsOf({ loadout, field }).map((current, index) => {
    if (index === slot) {
      return id;
    }

    return id !== null && current === id ? null : current;
  });

  return { ...loadout, [field]: next };
};

export const takenIds = ({ loadout, field, slot }: TakenIdsInput): number[] =>
  slotsOf({ loadout, field }).filter((id, index): id is number => index !== slot && id !== null);

export const roleSkills = ({ loadout, role }: RoleSkillsInput): string[] => loadout.crewSkills[role] ?? [];

export const toggleSkill = ({ loadout, role, skillId, max }: ToggleSkillInput): Loadout => {
  const current = roleSkills({ loadout, role });

  if (!current.includes(skillId) && current.length >= max) {
    return loadout;
  }

  const next = current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId];

  return { ...loadout, crewSkills: { ...loadout.crewSkills, [role]: next } };
};

export const chooseFieldMod = ({ loadout, steps, tag }: ChooseFieldModInput): Loadout => {
  const step = steps.find(({ options }) => options.some((option) => option.tag === tag));

  if (!step) {
    return loadout;
  }

  const stepTags = step.options.map((option) => option.tag);
  const isSelected = loadout.fieldModifications.includes(tag);
  const kept = loadout.fieldModifications.filter((selected) => !stepTags.includes(selected));
  const chosen = isSelected ? kept : [...kept, tag];
  const order = steps.flatMap(({ options }) => options.map((option) => option.tag));

  return { ...loadout, fieldModifications: sortBy(chosen, (selected) => order.indexOf(selected)) };
};

export const fieldModSide = ({ loadout, step }: FieldModSideInput): FieldModSide | null => {
  const index = step.options.findIndex((option) => loadout.fieldModifications.includes(option.tag));

  return index === 0 || index === 1 ? index : null;
};

export const moduleIdsOf = (loadout: Loadout): number[] =>
  (loadout.profileId ?? '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);

export const slotModules = ({ modules, slot, selection }: SlotModulesInput): BuildModule[] =>
  sortBy(
    modules.filter((module) => module.slot === slot && (slot !== 'gun' || module.turretId === selection.turret)),
    ({ tier }) => tier
  );

const topOf = (candidates: readonly BuildModule[]) =>
  candidates.reduce<BuildModule | null>((top, module) => (!top || module.tier >= top.tier ? module : top), null);

export const selectedModules = ({ loadout, modules }: ModulesInput): ModuleSelection => {
  const ids = moduleIdsOf(loadout);

  return MODULE_ORDER.reduce<ModuleSelection>((selection, slot) => {
    const candidates = slotModules({ modules, slot, selection });
    const picked = candidates.find((module) => ids.includes(module.id)) ?? topOf(candidates);

    return picked ? { ...selection, [slot]: picked.id } : selection;
  }, {});
};

const encode = (selection: ModuleSelection) => MODULE_SLOTS.flatMap((slot) => selection[slot] ?? []).join(',');

export const setModule = ({ loadout, modules, slot, moduleId }: SetModuleInput): Loadout => {
  const current = selectedModules({ loadout, modules });
  const next = selectedModules({ loadout: { ...loadout, profileId: encode({ ...current, [slot]: moduleId }) }, modules });

  return { ...loadout, profileId: encode(next) };
};

export const moduleKeys = ({ loadout, modules }: ModulesInput): LoadoutRequest['modules'] => {
  if (moduleIdsOf(loadout).length === 0) {
    return undefined;
  }

  const selection = selectedModules({ loadout, modules });

  return Object.fromEntries(
    MODULE_ORDER.flatMap((slot) => {
      const module = slotModules({ modules, slot, selection }).find(({ id }) => id === selection[slot]);

      return module ? [[slot, module.key]] : [];
    })
  );
};

export const loadoutRequest = ({ loadout, modules, still }: LoadoutRequestInput): LoadoutRequest => ({
  loadout: { ...loadout, profileId: LOADOUT_REQUEST.preset },
  modules: moduleKeys({ loadout, modules }),
  crewLevel: LOADOUT_REQUEST.crewLevel,
  state: { still, consumablesActive: false }
});

const normalized = ({ loadout, modules }: ModulesInput): Loadout => ({
  ...loadout,
  profileId: encode(selectedModules({ loadout, modules })),
  equipment: slotsOf({ loadout, field: 'equipment' }),
  consumables: slotsOf({ loadout, field: 'consumables' }),
  directives: slotsOf({ loadout, field: 'directives' }),
  crewSkills: Object.fromEntries(
    sortBy(Object.entries(loadout.crewSkills), ([role]) => role)
      .filter(([, ids]) => ids.length > 0)
      .map(([role, ids]) => [role, [...ids].sort()])
  )
});

export const sameLoadout = ({ a, b, modules }: SameLoadoutInput): boolean =>
  serializeLoadout(normalized({ loadout: a, modules })) === serializeLoadout(normalized({ loadout: b, modules }));
