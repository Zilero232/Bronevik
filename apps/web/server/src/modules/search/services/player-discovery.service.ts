import { Inject, Injectable, Logger } from '@nestjs/common';
import { uniqueBy } from 'remeda';

import type { AccountListItem, LestaClient } from '../../../lib/lesta';

import { LESTA_CLIENT, PrismaService } from '../../../core';
import { LestaNotConfiguredError } from '../../../lib/lesta';
import { CollectorProducerService } from '../../collector';
import { SEARCH_LOOKUP } from '../config';

@Injectable()
export class PlayerDiscoveryService {
  private readonly logger = new Logger(PlayerDiscoveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly collector: CollectorProducerService,
    @Inject(LESTA_CLIENT) private readonly lesta: LestaClient
  ) {}

  async discover(terms: string[]): Promise<AccountListItem[]> {
    const searchable = terms.filter((term) => term.length >= SEARCH_LOOKUP.minLestaLength).slice(0, SEARCH_LOOKUP.maxLestaTerms);

    if (searchable.length === 0) {
      return [];
    }

    const settled = await Promise.allSettled(
      searchable.map((search) => this.lesta.account.list({ search, type: 'startswith', limit: SEARCH_LOOKUP.lestaLimit }))
    );

    const found = uniqueBy(
      settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])),
      (item) => item.account_id
    );

    const failed = settled.filter((result) => result.status === 'rejected' && !(result.reason instanceof LestaNotConfiguredError));

    if (failed.length > 0) {
      this.logger.warn(`Lesta account/list failed for ${failed.length} term(s)`);
    }

    if (found.length === 0) {
      return [];
    }

    await this.prisma.player.createMany({
      data: found.map((item) => ({ accountId: BigInt(item.account_id), nickname: item.nickname })),
      skipDuplicates: true
    });

    await this.collector.enrolMany({ accountIds: found.slice(0, SEARCH_LOOKUP.enrolLimit).map((item) => item.account_id), priority: 'normal' });

    return found;
  }
}
