import type { MockPlayer, MockPlayerState, MockTotals, MockWorld } from '../../lesta-mock.types';
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

export type RatioInput = {
  value: number;
  by: number;
  digits?: number;
};

export type ExactValueInput = {
  field: RankField;
  state: MockPlayerState;
};

export type EstimateInput = {
  field: RankField;
  player: MockPlayer;
  at: number;
};

export type EligibleInput = {
  world: MockWorld;
  at: number;
};

export type FieldValueInput = {
  field: RankField;
  random: MockTotals;
  rating: number;
};

export type PeriodTotalsInput = {
  world: MockWorld;
  player: MockPlayer;
  at: number;
  days: number | null;
};
