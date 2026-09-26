import { load } from 'cheerio';
import { setTimeout } from 'node:timers/promises';
import robotsParser from 'robots-parser';

import type { CrawlPagesInput, RobotsPolicy, ScrapedPage } from './crawl.types';

import { http, HTTP } from '../../http';
import { SCRAPE } from '../scrape.constants';

const robotsFor = async (origin: string): Promise<RobotsPolicy> => {
  const url = `${origin}/robots.txt`;

  try {
    const text = await http.get(url, { timeout: SCRAPE.timeoutSecs * 1000 }).text();
    const robots = robotsParser(url, text);

    return {
      isAllowed: (target) => robots.isAllowed(target, HTTP.userAgent) !== false,
      delaySecs: robots.getCrawlDelay(HTTP.userAgent) ?? 0
    };
  } catch {
    return { isAllowed: () => true, delaySecs: 0 };
  }
};

export const crawlPages = async ({ urls, delaySecs = SCRAPE.delaySecs }: CrawlPagesInput): Promise<ScrapedPage[]> => {
  const policies = new Map<string, RobotsPolicy>();
  const lastHit = new Map<string, number>();
  const pages: ScrapedPage[] = [];

  for (const url of urls) {
    const { origin } = new URL(url);
    const policy = policies.get(origin) ?? (await robotsFor(origin));

    policies.set(origin, policy);

    if (!policy.isAllowed(url)) {
      continue;
    }

    const gapMs = Math.max(delaySecs, policy.delaySecs) * 1000;
    const since = Date.now() - (lastHit.get(origin) ?? 0);

    if (since < gapMs) {
      await setTimeout(gapMs - since);
    }

    lastHit.set(origin, Date.now());

    try {
      const html = await http.get(url, { timeout: SCRAPE.timeoutSecs * 1000, headers: { accept: SCRAPE.accept } }).text();

      pages.push({ url, $: load(html) });
    } catch {
      continue;
    }
  }

  return pages;
};
