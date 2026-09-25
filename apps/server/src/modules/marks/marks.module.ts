import { Module } from '@nestjs/common';

import { MarksController } from './marks.controller';
import { MoePublicController } from './moe-public.controller';
import { MoeTableService, ProjectionService } from './services';

@Module({
  controllers: [MarksController, MoePublicController],
  providers: [MoeTableService, ProjectionService],
  exports: [MoeTableService, ProjectionService]
})
export class MarksModule {}
