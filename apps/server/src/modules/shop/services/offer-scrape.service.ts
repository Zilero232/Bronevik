import { Injectable } from '@nestjs/common';

import type { PremiumOffer, Prisma } from '../../../../generated';
import type { ScrapeSummary, StoreOfferInput } from '../shop.types';

import { toJsonValue } from '../../../common/lib';
import { SOURCES } from '../../../config';
import { isUniqueViolation, PrismaService } from '../../../core';
import { crawlPages, parseTankiListing } from '../../../lib/scrape';
import { NotificationService } from '../../notifications';
import { NEWS_ENRICH, OFFER_SCRAPE } from '../config';
import { matchTankNames, parseOfferDetail } from '../lib';
import { BonusCodeService } from './bonus-code.service';

@Injectable()
export class OfferScrapeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
    private readonly bonusCodes: BonusCodeService
  ) {}

  async run(now: Date): Promise<ScrapeSummary> {
    const [listingPage] = await crawlPages({ urls: [SOURCES.tankiSpecialOffers] });
    const listing = listingPage ? parseTankiListing({ $: listingPage.$, baseUrl: SOURCES.tankiSite }) : [];
    const known = await this.prisma.premiumOffer.findMany({
      where: { source: OFFER_SCRAPE.source, url: { in: listing.map((item) => item.url) } },
      select: { url: true }
    });

    const knownUrls = new Set(known.flatMap((offer) => (offer.url ? [offer.url] : [])));

    await this.prisma.premiumOffer.updateMany({ where: { source: OFFER_SCRAPE.source, url: { in: [...knownUrls] } }, data: { lastSeenAt: now } });

    const fresh = listing.filter((item) => !knownUrls.has(item.url)).slice(0, OFFER_SCRAPE.maxDetailPages);
    const pages = await crawlPages({ urls: fresh.map((item) => item.url) });
    const vehicles = fresh.length > 0 ? await this.prisma.vehicle.findMany({ where: { isActive: true }, select: { tankId: true, name: true } }) : [];
    let notified = 0;

    for (const item of fresh) {
      const page = pages.find((candidate) => candidate.url === item.url);

      notified += await this.store({
        item,
        detail: page ? parseOfferDetail({ $: page.$, publishedAt: item.publishedAt ?? now }) : null,
        vehicles,
        now
      });
    }

    return { seen: listing.length, created: fresh.length, notified };
  }

  private async store({ item, detail, vehicles, now }: StoreOfferInput): Promise<number> {
    const tankIds = matchTankNames({ text: `${item.title}\n${detail?.text ?? ''}`, vehicles, minLength: NEWS_ENRICH.minTankNameLength });
    const discountPercent = detail?.tankDiscountPercent ?? null;
    const offer = await this.createOffer({
      source: OFFER_SCRAPE.source,
      externalId: new URL(item.url).pathname,
      title: item.title,
      url: item.url,
      image: item.image,
      tankIds,
      discountPercent,
      contents: toJsonValue({ discounts: detail?.discounts ?? [], bonusCodes: detail?.bonusCodes ?? [] }),
      startsAt: item.publishedAt ?? now,
      endsAt: detail?.endsAt ?? null
    });

    if (!offer) {
      return 0;
    }

    for (const code of detail?.bonusCodes ?? []) {
      await this.bonusCodes.discover({
        code,
        title: item.title,
        source: OFFER_SCRAPE.source,
        sourceUrl: item.url,
        expiresAt: detail?.endsAt ?? null
      });
    }

    let notified = 0;

    for (const tankId of tankIds) {
      const tankName = vehicles.find((vehicle) => vehicle.tankId === tankId)?.name ?? String(tankId);

      notified += await this.notifications.tankDiscounted({ tankId, tankName, discountPercent: discountPercent || null, offerId: offer.id });
    }

    return notified;
  }

  private async createOffer(data: Prisma.PremiumOfferUncheckedCreateInput): Promise<PremiumOffer | null> {
    try {
      return await this.prisma.premiumOffer.create({ data });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return null;
      }

      throw error;
    }
  }
}
