import type { z } from 'zod';

import type { NewsItem, PremiumOffer } from '../../../../../generated';
import type { newsItemSchema } from '../../dto/shop.schemas';

export type OfferViewInput = {
  offer: PremiumOffer;
  timesSeen: number;
};

export type NewsView = z.infer<typeof newsItemSchema>;

export type NewsWithVersion = NewsItem & {
  gameVersion: { version: string } | null;
};
