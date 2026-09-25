import type { CheerioAPI } from 'cheerio';

export type ParseWotexpressInput = {
  $: CheerioAPI;
  baseUrl: string;
  reference: Date;
};

export type ScrapedBonusCode = {
  code: string;
  title: string;
  sourceUrl: string;
  publishedAt: Date | null;
};
