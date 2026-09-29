import type { PlayerTank } from '../../../../../generated';

export type CommonTankIdsInput = {
  tanks: readonly Pick<PlayerTank, 'accountId' | 'tankId'>[];
  accountCount: number;
};
