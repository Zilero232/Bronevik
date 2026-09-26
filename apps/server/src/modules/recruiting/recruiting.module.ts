import { Module } from '@nestjs/common';

import { CommunityCoreModule } from '../community-core';
import { RecruitingController } from './recruiting.controller';
import { RecruitingService } from './services';

@Module({
  imports: [CommunityCoreModule],
  controllers: [RecruitingController],
  providers: [RecruitingService]
})
export class RecruitingModule {}
