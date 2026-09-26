import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CosmeticsController } from './cosmetics.controller';
import { ProgressionCoreModule } from './progression-core.module';
import { ProgressionController } from './progression.controller';
import { SeasonService, TankProgressService } from './services';

@Module({
  imports: [BillingCoreModule, ProgressionCoreModule],
  controllers: [ProgressionController, CosmeticsController],
  providers: [SeasonService, TankProgressService]
})
export class ProgressionModule {}
