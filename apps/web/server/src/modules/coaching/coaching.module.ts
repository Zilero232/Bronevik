import { Module } from '@nestjs/common';

import { CommunityCoreModule } from '../community-core';
import { CoachingController } from './coaching.controller';
import { CoachingOrderService, CoachProfileService } from './services';

@Module({
  imports: [CommunityCoreModule],
  controllers: [CoachingController],
  providers: [CoachProfileService, CoachingOrderService]
})
export class CoachingModule {}
