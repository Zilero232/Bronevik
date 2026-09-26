import { Module } from '@nestjs/common';

import { BoardLiveService, TacticBoardService, TacticsCollabService } from './services';
import { TacticsController } from './tactics.controller';

@Module({
  controllers: [TacticsController],
  providers: [BoardLiveService, TacticBoardService, TacticsCollabService]
})
export class TacticsModule {}
