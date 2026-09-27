import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { PULSE_QUEUE } from './config';
import { PulseProcessor, PulseSchedulesService } from './processors';
import { PulseService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: PULSE_QUEUE.name })],
  providers: [PulseService, PulseProcessor, PulseSchedulesService]
})
export class PulseWorkerModule {}
