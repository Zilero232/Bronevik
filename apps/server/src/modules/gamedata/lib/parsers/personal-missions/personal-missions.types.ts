import type { PyValue } from '../../python-literal';
import type { XmlNode } from '../../xml';
import type { PERSONAL_MISSION_BRANCHES } from './personal-missions.constants';

export type PersonalMissionBranchName = (typeof PERSONAL_MISSION_BRANCHES)[number];

export type PersonalMissionJson = boolean | number | string | PersonalMissionJson[] | { [key: string]: PersonalMissionJson } | null;

export type PersonalMissionRewardVehicle = {
  nation: string;
  tag: string;
};

export type PersonalCampaign = {
  campaignId: number;
  branch: PersonalMissionBranchName | null;
  name: string | null;
  description: string | null;
  reward: PersonalMissionRewardVehicle | null;
};

export type PersonalOperation = {
  operationId: number;
  campaignId: number;
  name: string | null;
  description: string | null;
  iconId: string | null;
  nextOperationIds: number[];
  chainsCount: number;
  missionsPerChain: number;
  chainsToUnlockNext: number;
  reward: PersonalMissionRewardVehicle | null;
};

export type PersonalBranchKind = 'alliance' | 'levelGroup' | 'vehicleClass';

export type PersonalBranch = {
  operationId: number;
  chainId: number;
  kind: PersonalBranchKind;
  key: string;
  nations: string[];
  minTier: number;
  maxTier: number;
};

export type PersonalMissionCondition = {
  progressId: string;
  isMain: boolean;
  isAward: boolean;
  template: string | null;
  display: string | null;
  icon: string | null;
  goal: number | null;
  params: Record<string, PersonalMissionJson>;
  title: string | null;
  description: string | null;
};

export type PersonalMission = {
  questId: number;
  name: string;
  branch: PersonalMissionBranchName;
  campaignId: number;
  operationId: number;
  chainId: number;
  position: number;
  title: string;
  shortTitle: string | null;
  description: string | null;
  advice: string | null;
  minTier: number;
  maxTier: number;
  vehicleClasses: string[];
  alliances: string[];
  levelGroup: string | null;
  isInitial: boolean;
  isFinal: boolean;
  hasHonors: boolean;
  requiredUnlocks: number[];
  conditions: PersonalMissionCondition[];
};

export type PersonalMissionsData = {
  campaigns: PersonalCampaign[];
  operations: PersonalOperation[];
  branches: PersonalBranch[];
  missions: PersonalMission[];
  warnings: string[];
};

export type PersonalMissionSources = {
  seasonsXml: string;
  tilesXml: string;
  listXml: string;
  configPy?: string;
  messages?: Record<string, string>;
};

export type Localize = (key: string | undefined) => string | undefined;

export type RenderTextInput = {
  template: string;
  values: Record<string, PersonalMissionJson>;
};

export type ParseConditionsInput = {
  mission: string;
  config: PyValue | undefined;
  localize: Localize;
};

export type ParseMissionsInput = {
  root: XmlNode;
  config: Record<string, PyValue>;
  localize: Localize;
  seasonOf: Map<number, number>;
};
