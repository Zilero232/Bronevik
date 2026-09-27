import { Module } from '@nestjs/common';

import { TechTreeService } from './services';
import { TreeController } from './tree.controller';

@Module({
  controllers: [TreeController],
  providers: [TechTreeService]
})
export class TreeModule {}
