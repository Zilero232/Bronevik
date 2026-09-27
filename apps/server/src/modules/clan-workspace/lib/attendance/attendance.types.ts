import type { Battle } from '../../../../../generated';

export type BattleSample = Pick<Battle, 'accountId' | 'battleType'>;

export type AttendedInput = {
  battles: readonly BattleSample[];
  bonusTypes: readonly number[];
};
