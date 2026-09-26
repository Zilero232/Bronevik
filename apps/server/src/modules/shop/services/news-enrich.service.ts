import { Injectable } from '@nestjs/common';
import { unique } from 'remeda';

import { PrismaService } from '../../../core';
import { NEWS_ENRICH } from '../config';
import { isPatchNotes, matchTankNames, patchVersion, versionCandidates } from '../lib';

@Injectable()
export class NewsEnrichService {
  constructor(private readonly prisma: PrismaService) {}

  async run(now: Date): Promise<number> {
    const items = await this.prisma.newsItem.findMany({
      where: { enrichedAt: null },
      orderBy: { publishedAt: 'desc' },
      take: NEWS_ENRICH.batch,
      select: { id: true, title: true, summary: true, kind: true, gameVersionId: true, tankIds: true }
    });

    if (items.length === 0) {
      return 0;
    }

    const vehicles = await this.prisma.vehicle.findMany({ select: { tankId: true, name: true } });

    for (const item of items) {
      const version = patchVersion(item.title);
      const gameVersion = version
        ? await this.prisma.gameVersion.findFirst({ where: { version: { in: versionCandidates(version) } }, select: { id: true } })
        : null;

      const mentioned = matchTankNames({ text: `${item.title}\n${item.summary ?? ''}`, vehicles, minLength: NEWS_ENRICH.minTankNameLength });

      await this.prisma.newsItem.update({
        where: { id: item.id },
        data: {
          kind: isPatchNotes(item.title) ? 'patchNotes' : item.kind,
          gameVersionId: item.gameVersionId ?? gameVersion?.id ?? null,
          tankIds: unique([...item.tankIds, ...mentioned]),
          enrichedAt: now
        }
      });
    }

    return items.length;
  }
}
