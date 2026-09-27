import type { VehicleSummary } from '@otmetki/schemas';

import type { OfferArchive } from '@/shared/api/generated';

import type { ReturnOutlook } from '../../../lib/return-outlook';

export type ReturnRow = OfferArchive[number] & {
  vehicle: VehicleSummary | null;
  outlook: ReturnOutlook;
};
