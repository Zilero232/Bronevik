import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from './billing-core.module';
import { BILLING_QUEUE } from './config';
import { BillingProcessor, BillingSchedulesService } from './processors';
import { RenewalService } from './services';

@Module({
  imports: [BillingCoreModule, BullModule.registerQueue({ name: BILLING_QUEUE.name })],
  providers: [RenewalService, BillingProcessor, BillingSchedulesService]
})
export class BillingWorkerModule {}
