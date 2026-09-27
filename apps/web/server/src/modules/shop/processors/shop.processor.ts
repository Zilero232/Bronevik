import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { SHOP_QUEUE } from '../config';
import { BonusCodeScrapeService, BonusCodeService, NewsEnrichService, OfferScrapeService } from '../services';

@Processor(SHOP_QUEUE.name, { concurrency: 1 })
export class ShopProcessor extends WorkerHost {
  constructor(
    private readonly offers: OfferScrapeService,
    private readonly codeScraper: BonusCodeScrapeService,
    private readonly bonusCodes: BonusCodeService,
    private readonly news: NewsEnrichService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    const now = new Date();

    return match(job.name)
      .with(SHOP_QUEUE.jobs.offers, () => this.offers.run(now))
      .with(SHOP_QUEUE.jobs.bonusCodes, () => this.codeScraper.run(now))
      .with(SHOP_QUEUE.jobs.bonusStatus, () => this.bonusCodes.refreshStatuses(now))
      .with(SHOP_QUEUE.jobs.newsEnrich, () => this.news.run(now))
      .otherwise(() => null);
  }
}
