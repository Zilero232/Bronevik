import type { PlayerCollection } from '../../achievements-rarity.types';
import type { ToSeriesViewInput } from './series-view.types';

export const toSeriesView = ({ row, items }: ToSeriesViewInput): PlayerCollection['series'][number] => ({
  ...row,
  title: items.get(row.name)?.title ?? row.name,
  image: items.get(row.name)?.image ?? null
});
