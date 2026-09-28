import type { MOCK_MODE_BLOCKS } from '../../config';
import type { MockTankState, MockTotals } from '../../lesta-mock.types';

export type MockTankModeKey = (typeof MOCK_MODE_BLOCKS.tank)[number];

export type MockAccountModeKey = (typeof MOCK_MODE_BLOCKS.accountOf)[MockTankModeKey];

export type TankModeOfInput = {
  seed: number;
  accountId: number;
  tank: MockTankState;
};

export type AccountModeTotalsInput = {
  seed: number;
  accountId: number;
  tanks: readonly MockTankState[];
};

export type AccountModeTotals = Record<MockAccountModeKey, MockTotals>;
