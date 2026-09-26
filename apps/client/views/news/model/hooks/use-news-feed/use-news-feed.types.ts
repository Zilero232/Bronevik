import type { NewsItem, VehicleSummary } from '@otmetki/schemas';

import type { NEWS } from '../../../config';

export type NewsFilter = (typeof NEWS.filters)[number];

export type NewsEntry = {
  item: NewsItem;
  vehicles: VehicleSummary[];
};
