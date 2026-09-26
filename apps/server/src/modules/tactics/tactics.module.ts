import { Module } from '@nestjs/common';

import { TacticBoardService, TacticsCollabService } from './services';
import { TacticsController } from './tactics.controller';

@Module({
  controllers: [TacticsController],
  providers: [TacticBoardService, TacticsCollabService]
})
export class TacticsModule {}
