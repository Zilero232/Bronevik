import { Module } from '@nestjs/common';

import { MarksController } from './marks.controller';
import { MoePublicController } from './moe-public.controller';
import { ModThresholdsService, MoeCurveService, MoeTableService, ProjectionService, SweatIndexService } from './services';

@Module({
  controllers: [MarksController, MoePublicController],
  providers: [MoeTableService, MoeCurveService, ModThresholdsService, ProjectionService, SweatIndexService],
  exports: [MoeTableService, SweatIndexService]
})
export class MarksModule {}
