import type { AccountEconomy, MyTankLearning } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { AccountEconomyRequest, MyLearningInput } from '../tanks.types';

import { UserLestaAccountsService } from '../../../core';
import { TankEconomyReportService } from './tank-economy-report.service';
import { TankLearningService } from './tank-learning.service';

@Injectable()
export class MyTankInsightsService {
  constructor(
    private readonly lestaAccounts: UserLestaAccountsService,
    private readonly economy: TankEconomyReportService,
    private readonly learning: TankLearningService
  ) {}

  async economyOf({ userId, query }: AccountEconomyRequest): Promise<AccountEconomy> {
    const accountId = await this.lestaAccounts.requirePrimaryAccountId({ userId, message: 'Link a Lesta account to see your own tank analytics' });

    return this.economy.account({ accountId, days: query.days });
  }

  async learningOf({ userId, tankId }: MyLearningInput): Promise<MyTankLearning> {
    const accountId = await this.lestaAccounts.requirePrimaryAccountId({ userId, message: 'Link a Lesta account to see your own tank analytics' });

    return this.learning.place({ accountId, tankId });
  }
}
