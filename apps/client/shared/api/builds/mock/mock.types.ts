import type { CrewRoleName, Modifier } from '@bronevik/gamedata';
import type { LoadoutRequest, ProvisionKind, VehicleStats } from '@bronevik/schemas';

import type { MockTank } from '@/shared/mocks';

import type { MOCK_SLOT_OFFSET } from './mock.constants';

export type MockProvisionSeed = {
  id: number;
  tag: string;
  name: string;
  kind: ProvisionKind;
  categories?: string[];
  gold?: number;
  modifiers: Modifier[];
};

export type MockSkillSeed = {
  skill: string;
  name: string;
  roles: CrewRoleName[];
  isCommon?: boolean;
  params?: { name: string; perLevel: number }[];
  extras?: Record<string, number>;
};

export type MockFieldStepSeed = {
  level: number;
  tags: string[];
};

export type MockLoadoutInput = {
  tankId: number;
  request: LoadoutRequest;
};

export type MockPopularInput = {
  tankId: number;
  limit: number;
};

export type MockModuleInput = {
  tank: MockTank;
  slot: keyof typeof MOCK_SLOT_OFFSET;
  isTop: boolean;
};

export type MockGunInput = {
  module: MockModuleInput;
  stats: VehicleStats;
};

export type MockPickInput = {
  ids: readonly (number | null)[];
  kind: ProvisionKind;
};
