import type { CheerioAPI } from 'cheerio';

export type ScrapedPage = {
  url: string;
  $: CheerioAPI;
};

export type CrawlPagesInput = {
  urls: readonly string[];
  delaySecs?: number;
};

export type RobotsPolicy = {
  isAllowed: (url: string) => boolean;
  delaySecs: number;
};
