import type { CheerioAPI } from 'cheerio';

export type ParseOfferDetailInput = {
  $: CheerioAPI;
  publishedAt: Date;
};

export type OfferDiscount = {
  percent: number;
  context: string;
};

export type OfferDetail = {
  text: string;
  discounts: OfferDiscount[];
  tankDiscountPercent: number | null;
  endsAt: Date | null;
  bonusCodes: string[];
};
