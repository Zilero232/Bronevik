import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { UsageActorGuard } from './guards';
import { UsageMeterService } from './services';
import { UsageController } from './usage.controller';

@Module({
  imports: [BillingCoreModule],
  controllers: [UsageController],
  providers: [UsageMeterService, UsageActorGuard],
  exports: [UsageMeterService, UsageActorGuard]
})
export class UsageModule {}
