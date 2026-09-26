import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CompetitionsController } from './competitions.controller';
import { CompetitionService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [CompetitionsController],
  providers: [CompetitionService]
})
export class CompetitionsModule {}
