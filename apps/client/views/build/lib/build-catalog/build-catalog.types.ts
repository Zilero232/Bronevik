import type { ModuleOption } from '@bronevik/schemas';

import type { BUILD_CATEGORIES, COMMON_ROLE, CREW_ROLE_ORDER } from './build-catalog.constants';

export type BuildCategory = (typeof BUILD_CATEGORIES)[number];

export type BuildCrewRole = (typeof CREW_ROLE_ORDER)[number] | typeof COMMON_ROLE;

export type BuildModuleSlot = 'chassis' | 'engine' | 'gun' | 'radio' | 'turret';

export type BuildModule = {
  id: number;
  key: string;
  slot: BuildModuleSlot;
  name: string;
  tier: number;
  turretId: number | null;
};

export type BuildItem = {
  id: number;
  tag: string;
  name: string;
  category: BuildCategory | null;
  isPremium: boolean;
};

export type BuildFieldStep = {
  key: string;
  level: number;
  options: BuildItem[];
};

export type BuildSkill = {
  id: string;
  name: string;
  roles: string[];
  isCommon: boolean;
};

export type BuildCatalog = {
  modules: BuildModule[];
  equipment: BuildItem[];
  consumables: BuildItem[];
  directives: BuildItem[];
  fieldSteps: BuildFieldStep[];
  skills: BuildSkill[];
  crewRoles: BuildCrewRole[];
};

export type ToModuleInput = {
  option: ModuleOption;
  slot: BuildModuleSlot;
  turretId?: number;
};

export type SkillsOfRoleInput = {
  skills: readonly BuildSkill[];
  role: BuildCrewRole;
};
