import { Injectable } from '@nestjs/common';

import type { ScrapeSummary } from '../shop.types';

import { SOURCES } from '../../../config';
import { PageCrawlerService } from '../../../core';
import { BONUS_CODE } from '../config';
import { parseWotexpressCodes } from '../lib';
import { BonusCodeService } from './bonus-code.service';

@Injectable()
export class BonusCodeScrapeService {
  constructor(
    private readonly bonusCodes: BonusCodeService,
    private readonly crawler: PageCrawlerService
  ) {}

  async run(now: Date): Promise<ScrapeSummary> {
    const [page] = await this.crawler.crawl({ urls: [SOURCES.wotexpressBonusCodes] });
    const scraped = page ? parseWotexpressCodes({ $: page.$, baseUrl: SOURCES.wotexpressBonusCodes, reference: now }) : [];
    let created = 0;

    for (const { code, title, sourceUrl } of scraped) {
      if (await this.bonusCodes.discover({ code, title, source: BONUS_CODE.wotexpressSource, sourceUrl, expiresAt: null })) {
        created += 1;
      }
    }

    return { seen: scraped.length, created, notified: created };
  }
}
