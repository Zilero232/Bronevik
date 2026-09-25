import { Module } from '@nestjs/common';

import { MapsController } from './maps.controller';
import { MapsService } from './services';

@Module({
  controllers: [MapsController],
  providers: [MapsService]
})
export class MapsModule {}
