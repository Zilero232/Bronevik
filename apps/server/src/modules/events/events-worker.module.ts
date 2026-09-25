import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { EVENTS_QUEUE } from './config';
import { EventsProcessor, EventsSchedulesService } from './processors';
import { DropsService, EventCalendarService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: EVENTS_QUEUE.name })],
  providers: [EventCalendarService, DropsService, EventsProcessor, EventsSchedulesService]
})
export class EventsWorkerModule {}
