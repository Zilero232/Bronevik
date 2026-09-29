import type { PlayerTank } from '../../../../../../generated';

export type TankBaseline = Pick<PlayerTank, 'battles' | 'markOfMastery' | 'tankId'>;

type CurrentTank = {
  tank_id: number;
  mark_of_mastery: number;
  statistics: { battles: number };
};

export type DiffAccountTanksInput = {
  baseline: readonly TankBaseline[];
  current: readonly CurrentTank[];
};

export type AccountTanksDiff = {
  changedTankIds: number[];
  masteryOnlyTankIds: number[];
};

export type HasNewBattlesInput = {
  storedLastBattleAt: Date | null | undefined;
  lastBattleTime: number;
  neverScanned: boolean;
};
