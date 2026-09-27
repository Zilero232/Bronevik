import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core';
import { PURGE } from '../config';

@Injectable()
export class PurgeGuardService {
  constructor(private readonly prisma: PrismaService) {}

  async blocked(accountIds: readonly number[]): Promise<Set<number>> {
    if (accountIds.length === 0) {
      return new Set();
    }

    const requests = await this.prisma.dataDeletionRequest.findMany({
      where: {
        accountId: { in: accountIds.map(BigInt) },
        source: { in: [...PURGE.blockingSources] },
        status: { in: [...PURGE.blockingStatuses] }
      },
      select: { accountId: true },
      distinct: ['accountId']
    });

    return new Set(requests.map((request) => Number(request.accountId)));
  }
}
