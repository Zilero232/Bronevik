import { Module } from '@nestjs/common';

import { CommunityCoreModule } from '../community-core';
import { TournamentService } from './services';
import { TournamentsController } from './tournaments.controller';

@Module({
  imports: [CommunityCoreModule],
  controllers: [TournamentsController],
  providers: [TournamentService]
})
export class TournamentsModule {}
