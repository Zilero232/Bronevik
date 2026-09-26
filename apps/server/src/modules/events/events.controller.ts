import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { EVENT_ICS } from './config';
import { GameEventListDto, GameEventsQueryDto } from './dto';
import { EventQueryService } from './services';

@ApiTags('events')
@AllowAnonymous()
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventQueryService) {}

  @Get()
  @ZodResponse({ type: GameEventListDto })
  calendar(@Query() query: GameEventsQueryDto) {
    return this.events.calendar(query);
  }

  @Get('calendar.ics')
  @Header('content-type', EVENT_ICS.contentType)
  @Header('cache-control', EVENT_ICS.cacheControl)
  @ApiProduces(EVENT_ICS.contentType)
  @ApiOkResponse({ schema: { type: 'string' } })
  calendarIcs() {
    return this.events.calendarIcs();
  }

  @Get('drops')
  @ZodResponse({ type: GameEventListDto })
  drops() {
    return this.events.activeDrops();
  }
}
