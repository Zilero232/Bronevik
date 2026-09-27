import { Injectable } from '@nestjs/common';

import { crawlPages } from '../../lib/scrape';

@Injectable()
export class PageCrawlerService {
  readonly crawl = crawlPages;
}
