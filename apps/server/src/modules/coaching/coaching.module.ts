import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CommunityCoreModule } from '../community-core';
import { CoachingController } from './coaching.controller';
import { CoachingOrderService, CoachingPaymentService, CoachProfileService } from './services';

@Module({
  imports: [BillingCoreModule, CommunityCoreModule],
  controllers: [CoachingController],
  providers: [CoachProfileService, CoachingOrderService, CoachingPaymentService]
})
export class CoachingModule {}
