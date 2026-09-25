import type { CheerioAPI } from 'cheerio';

export type ListingItem = {
  url: string;
  title: string;
  image: string | null;
  publishedAt: Date | null;
};

export type ParseListingInput = {
  $: CheerioAPI;
  baseUrl: string;
};

export type AbsoluteUrlInput = {
  href: string;
  baseUrl: string;
};
