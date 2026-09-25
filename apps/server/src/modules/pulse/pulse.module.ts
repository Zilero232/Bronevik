import { Module } from '@nestjs/common';

import { PulseController } from './pulse.controller';
import { PulseService } from './services';

@Module({
  controllers: [PulseController],
  providers: [PulseService]
})
export class PulseModule {}
