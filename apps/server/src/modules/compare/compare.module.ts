import { Module } from '@nestjs/common';

import { PlayersModule } from '../players';
import { CompareController } from './compare.controller';
import { PlayerCompareService, TankCompareService } from './services';

@Module({
  imports: [PlayersModule],
  controllers: [CompareController],
  providers: [PlayerCompareService, TankCompareService]
})
export class CompareModule {}
