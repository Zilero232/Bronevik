import type { Battle, TankBattleDelta } from '../../../../../generated';

export type BattleSample = {
  tankId: number;
  battles: number;
  wins: number;
  damage: number;
  spotted: number;
  frags: number;
  blocked: number;
  survived: number;
  isSingle: boolean;
  moeRaised: boolean | null;
};

export type DeltaRow = Pick<TankBattleDelta, 'battles' | 'damageBlocked' | 'damageDealt' | 'frags' | 'spotted' | 'survived' | 'tankId' | 'wins'>;

export type ModBattleRow = Pick<Battle, 'damageBlocked' | 'damageDealt' | 'frags' | 'moePercentDelta' | 'result' | 'spotted' | 'survived' | 'tankId'>;

export type PickSamplesInput = {
  api: readonly BattleSample[];
  mod: readonly BattleSample[];
};
