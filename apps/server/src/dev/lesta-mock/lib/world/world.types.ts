import type { MockCatalog, MockClan, MockPlayer } from '../../lesta-mock.types';

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
