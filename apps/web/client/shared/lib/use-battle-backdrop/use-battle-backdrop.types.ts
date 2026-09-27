import type { BATTLE_BACKDROP } from '../battle-backdrop';

export type BattleBackdropDensity = keyof typeof BATTLE_BACKDROP.density;

export type UseBattleBackdropInput = {
  seed: number;
  density: BattleBackdropDensity;
};
