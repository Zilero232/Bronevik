import { Module } from '@nestjs/common';

import { CommunityCoreModule } from '../community-core';
import { PlatoonsController } from './platoons.controller';
import { PlatoonService } from './services';

@Module({
  imports: [CommunityCoreModule],
  controllers: [PlatoonsController],
  providers: [PlatoonService]
})
export class PlatoonsModule {}
