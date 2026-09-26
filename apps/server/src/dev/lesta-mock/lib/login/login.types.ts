import type { MockPlayer, MockWorld } from '../../lesta-mock.types';

export type LoginRouterInput = {
  world: MockWorld;
  apiUrl: string;
};

export type PickerRow = {
  player: MockPlayer;
  clanTag: string | null;
  winRate: number;
  rating: number;
};
