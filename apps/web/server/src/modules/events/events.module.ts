import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { EventQueryService } from './services';

@Module({
  controllers: [EventsController],
  providers: [EventQueryService]
})
export class EventsModule {}
