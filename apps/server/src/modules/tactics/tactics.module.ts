import { Module } from '@nestjs/common';

import { BoardLiveService, CollabRedisService, TacticBoardService, TacticsCollabService } from './services';
import { TacticsController } from './tactics.controller';

@Module({
  controllers: [TacticsController],
  providers: [BoardLiveService, CollabRedisService, TacticBoardService, TacticsCollabService]
})
export class TacticsModule {}
