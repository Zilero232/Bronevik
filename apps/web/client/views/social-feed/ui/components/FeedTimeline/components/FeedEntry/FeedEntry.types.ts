import type { VehicleSummary } from '@otmetki/schemas';

import type { SocialFeedItem } from '../../../../../api';

export type FeedEntryProps = {
  item: SocialFeedItem;
  vehicle: VehicleSummary | null;
};
