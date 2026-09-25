import type { CREW_ROLES } from './model.constants';

export type CrewRoleName = (typeof CREW_ROLES)[number];

export type CrewRole = {
  role: CrewRoleName;
  nameKey?: string;
  displayName: string;
  icon?: string;
  skills: string[];
};

export type SkillParam = {
  name: string;
  perLevel: number;
  situational: boolean;
  measureType?: string;
};

export type CrewSkill = {
  name: string;
  role: 'common' | CrewRoleName;
  roles: CrewRoleName[];
  isCommon: boolean;
  typeName?: string;
  vsePerk?: number;
  singleOnVehicle: boolean;
  params: SkillParam[];
  extras: Record<string, boolean | number | string>;
};

export type CrewData = {
  roles: CrewRole[];
  skills: CrewSkill[];
};
