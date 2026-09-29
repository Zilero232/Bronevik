import type { Battle } from '../../../../../generated';

export type MarkBattle = Pick<Battle, 'accountId' | 'id' | 'startedAt' | 'tankId'> & { marksOnGun: number };

export type MarkPair = Pick<MarkBattle, 'accountId' | 'tankId'>;

export type DetectMarkGainsInput = {
  battles: readonly MarkBattle[];
  previous: ReadonlyMap<string, number>;
};
