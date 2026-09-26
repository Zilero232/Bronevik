import { Inject, Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { LestaClients } from '../../../core';
import type { AchievementsFetchResult } from '../achievements-rarity.types';
import type { FetchCandidateRow } from '../queries';

import { Prisma } from '../../../../generated';
import { LESTA_CLIENTS, PrismaService } from '../../../core';
import { ACHIEVEMENTS_FETCH } from '../config';
import { fetchCandidatesSql } from '../queries';

@Injectable()
export class AchievementsFetchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients
  ) {}

  async fetch(now = new Date()): Promise<AchievementsFetchResult> {
    const candidates = await this.prisma.$queryRaw<FetchCandidateRow[]>(
      fetchCandidatesSql({ now, staleBefore: subDays(now, ACHIEVEMENTS_FETCH.refreshDays), limit: ACHIEVEMENTS_FETCH.batch })
    );

    if (candidates.length === 0) {
      return { requested: 0, stored: 0 };
    }

    const byAccount = await this.clients.bulk.account.achievements({ accountIds: candidates.map(({ accountId }) => String(accountId)) });

    const rows = candidates.flatMap(({ accountId }) => {
      const entry = byAccount[String(accountId)];

      return entry ? [{ accountId, counts: entry.achievements, maxSeries: entry.max_series ?? Prisma.JsonNull }] : [];
    });

    await this.prisma.$transaction(
      rows.map(({ accountId, counts, maxSeries }) =>
        this.prisma.accountAchievements.upsert({
          where: { accountId },
          create: { accountId, counts, maxSeries, fetchedAt: now },
          update: { counts, maxSeries, fetchedAt: now }
        })
      )
    );

    return { requested: candidates.length, stored: rows.length };
  }

  async backfill(now = new Date()): Promise<AchievementsFetchResult> {
    const total: AchievementsFetchResult = { requested: 0, stored: 0 };

    for (let run = 0; run < ACHIEVEMENTS_FETCH.backfillRuns; run += 1) {
      const result = await this.fetch(now);

      total.requested += result.requested;
      total.stored += result.stored;

      if (result.requested < ACHIEVEMENTS_FETCH.batch || result.stored === 0) {
        break;
      }
    }

    return total;
  }
}
