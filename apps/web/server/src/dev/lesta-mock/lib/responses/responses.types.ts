import type { LestaMockEnvelope, LestaMockParams, MockClan, MockPlayer, MockTankState, MockVehicle, MockWorld } from '../../lesta-mock.types';
import type { RankField, RANKINGS } from '../rankings';

export type MockContext = {
  world: MockWorld;
  method: string;
  params: LestaMockParams;
  now: number;
  fields: string[];
  extra: string[];
  tokenAccountId: number | null;
  hasToken: boolean;
  loginUrl: string;
};

export type MockRoute = (context: MockContext) => LestaMockEnvelope;

export type FailInput = {
  code: number;
  message: string;
  field?: string | null;
  value?: string | null;
};

export type IdListInput = {
  params: LestaMockParams;
  field: string;
  required?: boolean;
  limit?: number;
};

export type IdListResult = { error: LestaMockEnvelope } | { ids: number[] };

export type PlayerAtInput = {
  context: MockContext;
  accountId: number;
};

export type StateOfInput = {
  context: MockContext;
  player: MockPlayer;
};

export type MasteryOfInput = {
  context: MockContext;
  tank: MockTankState;
};

export type RecordTankInput = {
  tanks: readonly MockTankState[];
  pick: (tank: MockTankState) => number;
};

export type AccountBlockInput = {
  tanks: readonly MockTankState[];
  mode: 'all' | 'random';
};

export type AccountInfoInput = {
  context: MockContext;
  player: MockPlayer;
};

export type ClanExistsInput = {
  clan: MockClan;
  at: number;
};

export type NameAtInput = {
  clan: MockClan;
  at: number;
};

export type ListItemInput = {
  clan: MockClan;
  at: number;
};

export type ClanInfoInput = {
  context: MockContext;
  clan: MockClan;
};

export type ClansByIdsInput = {
  context: MockContext;
  render: (clan: MockClan) => unknown;
};

export type ProvincesCountInput = {
  context: MockContext;
  clan: MockClan;
};

export type AchievementImageInput = {
  name: string;
  big?: boolean;
};

export type ByTypeInput = {
  context: MockContext;
  vehicle: MockVehicle;
  type: string;
};

export type VehicleEntryInput = {
  context: MockContext;
  vehicle: MockVehicle;
};

export type OkInput = {
  data: unknown;
  meta?: Record<string, number>;
};

export type ListOfInput = {
  params: LestaMockParams;
  key: string;
};

export type IntParamInput = {
  params: LestaMockParams;
  key: string;
  fallback: number;
};

export type HasExtraInput = {
  context: MockContext;
  extra: string;
};

export type TanksOfInput = {
  context: MockContext;
  accountId: number;
};

export type TankStatsInput = {
  context: MockContext;
  accountId: number;
  tank: MockTankState;
};

export type ModeBlocksInput = {
  context: MockContext;
  player: MockPlayer;
  tanks: readonly MockTankState[];
};

export type RatingTypeOfInput = {
  type: (typeof RANKINGS.types)[number];
};

export type RatingAccountInput = RatingTypeOfInput & {
  context: MockContext;
  accountId: number;
  at: number;
};

export type RankDeltaInput = {
  context: MockContext;
  field: RankField;
  accountId: number;
  at: number;
};
