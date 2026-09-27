import type { MockPlayer } from '../../lesta-mock.types';

export type ProgressFactorInput = {
  player: Pick<MockPlayer, 'drift'>;
  at: number;
};
