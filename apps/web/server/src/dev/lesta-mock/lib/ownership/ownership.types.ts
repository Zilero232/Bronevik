import type { MockTankState } from '../../lesta-mock.types';

export type IsInGarageInput = {
  seed: number;
  accountId: number;
  tank: MockTankState;
  at: number;
};
