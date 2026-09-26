import { Module } from '@nestjs/common';

import { AnalyticsCoreModule } from '../analytics';
import { BillingCoreModule } from '../billing';
import { SupertestQueryService } from './services';
import { SupertestController } from './supertest.controller';

@Module({
  imports: [AnalyticsCoreModule, BillingCoreModule],
  controllers: [SupertestController],
  providers: [SupertestQueryService]
})
export class SupertestModule {}
