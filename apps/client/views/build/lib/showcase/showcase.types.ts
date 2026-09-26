import type { BuildUsage, ProvisionOption, ProvisionPick, ShellUsage } from '@otmetki/schemas';

import type { EquipTileCategory } from '@/entities/tank/build';

import type { BuildFieldStep } from '../build-catalog';

export type ShowcaseTile = {
  id: number;
  name: string;
  image: string | null;
  category: EquipTileCategory;
  share: number | null;
};

export type ShowcaseEquipmentColumn = {
  category: EquipTileCategory;
  primary: (ShowcaseTile | null)[];
  alternative: (ShowcaseTile | null)[] | null;
  directive: ShowcaseTile | null;
  directiveAlternative: ShowcaseTile | null;
};

export type EquipmentMatrixInput = {
  usage: BuildUsage;
  devices: readonly ProvisionOption[];
  slots: number;
};

export type FieldModOption = {
  id: number;
  name: string;
  image: string | null;
  share: number | null;
  isPicked: boolean;
};

export type FieldModPairView = {
  key: string;
  level: number;
  options: FieldModOption[];
};

export type FieldModRingInput = {
  steps: readonly BuildFieldStep[];
  usage: BuildUsage | null;
};

export type CrewSkillView = {
  skill: string;
  name: string;
  image: string | null;
  share: number;
};

export type CrewColumnView = {
  role: string;
  skills: CrewSkillView[];
};

export type CrewColumnsInput = {
  usage: BuildUsage;
  limit: number;
};

export type ShellMixPart = {
  shellId: number;
  label: string;
  isPremium: boolean;
  ammoShare: number;
};

export type ShellMixInput = {
  shells: readonly ShellUsage[];
};

export type FamilyScore = {
  family: string;
  score: number;
};

export type PickTileInput = {
  pick: ProvisionPick | undefined;
  category: EquipTileCategory;
};

export type OptionShareInput = {
  usage: BuildUsage;
  optionId: number;
};

export type FamilyTileInput = {
  usage: BuildUsage;
  devices: readonly ProvisionOption[];
  family: string;
  category: EquipTileCategory;
};
