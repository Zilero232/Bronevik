import type { MockActivity, MockCatalog, MockClan, MockClanStint, MockPlayer } from '../../lesta-mock.types';
import type { MockRng } from '../random';

export type CreateMockWorldInput = {
  catalog: MockCatalog;
  seed?: number;
  players?: number;
  clans?: number;
};

export type BuildClansInput = {
  seed: number;
  count: number;
};

export type AssignMembersInput = {
  seed: number;
  clans: MockClan[];
  players: MockPlayer[];
};

export type OfficerSlots = Readonly<Record<string, readonly [number, number]>>;

export type BetweenInput = {
  rng: MockRng;
  range: readonly [number, number];
};

export type LastBattleBeforeAnchorInput = {
  rng: MockRng;
  activity: MockActivity;
  createdAt: number;
};

export type OfficerRolesInput = {
  rng: MockRng;
  slots: OfficerSlots;
};

export type JoinedAtForInput = {
  rng: MockRng;
  clan: MockClan;
  player: MockPlayer;
};

export type AddStintInput = {
  clan: MockClan;
  player: MockPlayer;
  stint: MockClanStint;
};

export type StintAtInput = {
  player: MockPlayer;
  at: number;
};

export type ClanMembersAtInput = {
  clan: MockClan;
  at: number;
};

export type AccountExistsAtInput = {
  player: MockPlayer;
  at: number;
};
