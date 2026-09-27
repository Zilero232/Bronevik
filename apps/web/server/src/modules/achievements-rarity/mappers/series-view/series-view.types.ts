import type { CatalogRow } from '../../achievements-rarity.types';
import type { SeriesProgress } from '../../lib';

export type ToSeriesViewInput = {
  row: SeriesProgress;
  items: ReadonlyMap<string, Pick<CatalogRow, 'image' | 'title'>>;
};
