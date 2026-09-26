import type { BuildOptions, ProvisionOption } from '@otmetki/schemas';

import { gameLabel } from '@/entities/tank/build';

import type {
  BuildCatalog,
  BuildCategory,
  BuildCrewRole,
  BuildItem,
  BuildModule,
  BuildSkill,
  SkillsOfRoleInput,
  ToModuleInput
} from './build-catalog.types';

import { BUILD_CATALOG, BUILD_CATEGORIES, CREW_ROLE_ORDER } from './build-catalog.constants';

const CATEGORIES: ReadonlySet<string> = new Set(BUILD_CATEGORIES);

const isCategory = (value: string): value is BuildCategory => CATEGORIES.has(value);

const toModule = ({ option, slot, turretId }: ToModuleInput): BuildModule => ({
  id: option.moduleId,
  key: option.name,
  slot,
  name: gameLabel(option.displayName),
  tier: option.tier ?? 0,
  turretId: turretId ?? null
});

export const toBuildItem = ({ id, tag, name, kind, image, categories, price }: ProvisionOption): BuildItem => ({
  id,
  tag,
  name: gameLabel(name),
  kind,
  image,
  category: categories.find(isCategory) ?? null,
  isPremium: price?.currency === BUILD_CATALOG.premiumCurrency
});

const crewRolesOf = ({ crew, crewSkills }: BuildOptions): BuildCrewRole[] => {
  const present = new Set(crew.flatMap(({ role, extraRoles }) => [role, ...extraRoles]));
  const roles: BuildCrewRole[] = CREW_ROLE_ORDER.filter((role) => present.has(role));

  return crewSkills.some(({ isCommon }) => isCommon) ? [BUILD_CATALOG.commonRole, ...roles] : roles;
};

export const buildCatalog = (options: BuildOptions): BuildCatalog => ({
  modules: [
    ...options.modules.turrets.map((option) => toModule({ option, slot: 'turret' })),
    ...options.modules.turrets.flatMap((turret) => turret.guns.map((option) => toModule({ option, slot: 'gun', turretId: turret.moduleId }))),
    ...options.modules.engines.map((option) => toModule({ option, slot: 'engine' })),
    ...options.modules.chassis.map((option) => toModule({ option, slot: 'chassis' })),
    ...options.modules.radios.map((option) => toModule({ option, slot: 'radio' }))
  ],
  equipment: options.optionalDevices.map(toBuildItem),
  consumables: options.consumables.map(toBuildItem),
  directives: options.directives.map(toBuildItem),
  fieldSteps: options.fieldModifications.map(({ level, options: items }) => ({
    key: items.map(({ tag }) => tag).join('|'),
    level,
    options: items.map(toBuildItem)
  })),
  skills: options.crewSkills.map(({ skill, name, image, roles, isCommon }): BuildSkill => ({
    id: skill,
    name: gameLabel(name),
    image,
    roles,
    isCommon
  })),
  crewRoles: crewRolesOf(options)
});

export const skillsOfRole = ({ skills, role }: SkillsOfRoleInput): BuildSkill[] =>
  role === BUILD_CATALOG.commonRole
    ? skills.filter(({ isCommon }) => isCommon)
    : skills.filter(({ isCommon, roles }) => !isCommon && roles.includes(role));
