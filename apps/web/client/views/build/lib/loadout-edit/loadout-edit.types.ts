import type { Loadout } from '@otmetki/schemas';

import type { BuildFieldStep, BuildModule, BuildModuleSlot } from '../build-catalog';

export type LoadoutSlotField = 'consumables' | 'directives' | 'equipment';

export type ModuleSelection = Partial<Record<BuildModuleSlot, number>>;

export type FieldModSide = 0 | 1;

export type SlotsOfInput = {
  loadout: Loadout;
  field: LoadoutSlotField;
};

export type SetSlotItemInput = SlotsOfInput & {
  slot: number;
  id: number | null;
};

export type TakenIdsInput = SlotsOfInput & {
  slot: number;
};

export type ToggleSkillInput = {
  loadout: Loadout;
  role: string;
  skillId: string;
  max: number;
};

export type RoleSkillsInput = {
  loadout: Loadout;
  role: string;
};

export type ChooseFieldModInput = {
  loadout: Loadout;
  steps: readonly BuildFieldStep[];
  tag: string;
};

export type FieldModSideInput = {
  loadout: Loadout;
  step: BuildFieldStep;
};

export type ModulesInput = {
  loadout: Loadout;
  modules: readonly BuildModule[];
};

export type SlotModulesInput = {
  modules: readonly BuildModule[];
  slot: BuildModuleSlot;
  selection: ModuleSelection;
};

export type SetModuleInput = ModulesInput & {
  slot: BuildModuleSlot;
  moduleId: number;
};

export type SameLoadoutInput = {
  a: Loadout;
  b: Loadout;
  modules: readonly BuildModule[];
};

export type LoadoutRequestInput = ModulesInput & {
  still: boolean;
};
