import { Injectable } from '@nestjs/common';

import type { Prisma } from '../../../../generated';
import type { ArchiveEntry, OfferArchive, OfferPage, OffersQuery } from '../shop.types';

import { toIso } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { OFFER_RETURN } from '../config';
import { offerAppearance, returnEstimate, toOfferView } from '../lib';

@Injectable()
export class OfferQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ active, tankId, limit, offset }: OffersQuery): Promise<OfferPage> {
    const now = new Date();
    const where: Prisma.PremiumOfferWhereInput = {
      ...(tankId === undefined ? {} : { tankIds: { has: tankId } }),
      ...(active ? { OR: [{ endsAt: null }, { endsAt: { gt: now } }] } : {})
    };

    const [rows, total] = await Promise.all([
      this.prisma.premiumOffer.findMany({ where, orderBy: [{ startsAt: 'desc' }, { firstSeenAt: 'desc' }], take: limit, skip: offset }),
      this.prisma.premiumOffer.count({ where })
    ]);

    const counts = await this.timesSeen(rows.flatMap((row) => row.tankIds));

    return {
      items: rows.map((offer) => toOfferView({ offer, timesSeen: Math.max(1, ...offer.tankIds.map((id) => counts.get(id) ?? 1)) })),
      total,
      limit,
      offset
    };
  }

  async archive(tankId: number | undefined): Promise<OfferArchive> {
    const offers = await this.prisma.premiumOffer.findMany({
      where: tankId === undefined ? { tankIds: { isEmpty: false } } : { tankIds: { has: tankId } },
      orderBy: { firstSeenAt: 'asc' },
      select: { tankIds: true, startsAt: true, firstSeenAt: true, discountPercent: true }
    });

    const byTank = new Map<number, ArchiveEntry>();

    for (const offer of offers) {
      for (const id of offer.tankIds) {
        if (tankId !== undefined && id !== tankId) {
          continue;
        }

        const entry = byTank.get(id) ?? { appearances: [], lastDiscountPercent: null };

        entry.appearances.push(offerAppearance(offer));
        entry.lastDiscountPercent = offer.discountPercent ?? entry.lastDiscountPercent;
        byTank.set(id, entry);
      }
    }

    const vehicles = await this.prisma.vehicle.findMany({ where: { tankId: { in: [...byTank.keys()] } }, select: { tankId: true, name: true } });

    return [...byTank.entries()]
      .map(([id, entry]) => {
        const estimate = returnEstimate(entry.appearances);

        return {
          tankId: id,
          tankName: vehicles.find((vehicle) => vehicle.tankId === id)?.name ?? null,
          timesSeen: estimate.timesSeen,
          lastSeenAt: toIso(estimate.lastSeenAt),
          lastDiscountPercent: entry.lastDiscountPercent,
          medianIntervalDays: estimate.medianIntervalDays,
          nextExpectedAt: toIso(estimate.nextExpectedAt)
        };
      })
      .sort((a, b) => (b.lastSeenAt ?? '').localeCompare(a.lastSeenAt ?? ''))
      .slice(0, OFFER_RETURN.archiveLimit);
  }

  private async timesSeen(tankIds: readonly number[]): Promise<Map<number, number>> {
    const unique = [...new Set(tankIds)];
    const counts = new Map<number, number>();

    if (unique.length === 0) {
      return counts;
    }

    const rows = await this.prisma.premiumOffer.findMany({ where: { tankIds: { hasSome: unique } }, select: { tankIds: true } });

    for (const row of rows) {
      for (const id of row.tankIds) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }

    return counts;
  }
}
