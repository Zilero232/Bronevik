import type { FeedScope } from '../best-battles-feed';

export type FacetsScope = Pick<FeedScope, 'battleTypes' | 'since'>;

export type FacetSqlInput = FacetsScope & {
  take: number;
};

export type FacetTotalsRow = {
  battles: number;
  top_damage: number | null;
};

export type FacetCountRow = {
  key: string;
  battles: number;
};
