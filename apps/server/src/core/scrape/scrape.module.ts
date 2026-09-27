import { Module } from '@nestjs/common';

import { PageCrawlerService } from './page-crawler.service';

@Module({
  providers: [PageCrawlerService],
  exports: [PageCrawlerService]
})
export class ScrapeModule {}
