import type { Battle } from '../../../../../generated';
import type { RngWatermark } from '../../lib';

export type RngBattlesSqlInput = {
  watermark: RngWatermark | null;
  until: Date;
  limit: number;
};

export type RngBattleRow = Pick<
  Battle,
  'accountId' | 'id' | 'receivedAt' | 'shots' | 'shotsFired' | 'shotsHit' | 'shotsPierced' | 'startedAt' | 'tankId'
>;
