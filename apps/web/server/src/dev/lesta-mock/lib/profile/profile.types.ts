import type { MockPlayer, MockPlayerState, MockWorld } from '../../lesta-mock.types';

export type ProfileInput = {
  world: MockWorld;
  player: MockPlayer;
  state: MockPlayerState;
};

export type IsPremiumAtInput = {
  seed: number;
  player: MockPlayer;
  at: number;
};
