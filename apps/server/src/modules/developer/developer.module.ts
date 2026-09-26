import { Module } from '@nestjs/common';

import { DeveloperPlansController } from './developer-plans.controller';
import { DeveloperController } from './developer.controller';
import { ApiKeysService, ApiUsageReportService, DeveloperPlanService, WebhookEndpointsService } from './services';

@Module({
  controllers: [DeveloperController, DeveloperPlansController],
  providers: [DeveloperPlanService, ApiKeysService, ApiUsageReportService, WebhookEndpointsService],
  exports: [ApiKeysService]
})
export class DeveloperModule {}
