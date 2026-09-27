import type { PremiumOffer, VehicleSummary } from '@otmetki/schemas';

export type UseShopOffersInput = {
  isActiveOnly: boolean;
};

export type OfferEntry = {
  offer: PremiumOffer;
  href: string | undefined;
  vehicles: VehicleSummary[];
  isRunning: boolean;
};
