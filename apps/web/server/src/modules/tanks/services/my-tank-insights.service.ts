import type { AccountEconomy, MyTankLearning } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { AccountEconomyRequest, MyLearningInput } from '../tanks.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { TankEconomyReportService } from './tank-economy-report.service';
import { TankLearningService } from './tank-learning.service';

@Injectable()
export class MyTankInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly economy: TankEconomyReportService,
    private readonly learning: TankLearningService
  ) {}

  async economyOf({ userId, query }: AccountEconomyRequest): Promise<AccountEconomy> {
    const accountId = await this.primaryAccount(userId);

    return this.economy.account({ accountId, days: query.days });
  }

  async learningOf({ userId, tankId }: MyLearningInput): Promise<MyTankLearning> {
    const accountId = await this.primaryAccount(userId);

    return this.learning.place({ accountId, tankId });
  }

  private async primaryAccount(userId: string): Promise<bigint> {
    const link = await this.prisma.userLestaAccount.findFirst({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { linkedAt: 'asc' }],
      select: { accountId: true }
    });

    if (!link) {
      throw new AppNotFoundException('NOT_FOUND', 'Link a Lesta account to see your own tank analytics');
    }

    return link.accountId;
  }
}
