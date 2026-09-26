import type { MockPlayer, MockWorld } from '../../lesta-mock.types';
import type { RANK_FIELDS } from './rankings.constants';

export type RankField = (typeof RANK_FIELDS)[number];

export type RankingEntry = {
  player: MockPlayer;
  value: number;
};

export type Ranking = {
  date: number;
  depth: number;
  entries: RankingEntry[];
  rankOf: ReadonlyMap<number, number>;
};

export type RankingInput = {
  world: MockWorld;
  field: RankField;
  at: number;
  depth: number;
};
