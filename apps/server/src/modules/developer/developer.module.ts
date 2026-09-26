import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { DeveloperTiersController } from './developer-tiers.controller';
import { DeveloperController } from './developer.controller';
import { ApiKeysService, ApiTierService, ApiUsageReportService, HostLookupService, WebhookEndpointsService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [DeveloperController, DeveloperTiersController],
  providers: [HostLookupService, ApiTierService, ApiKeysService, ApiUsageReportService, WebhookEndpointsService],
  exports: [ApiKeysService]
})
export class DeveloperModule {}
