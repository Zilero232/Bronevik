import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

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

  @Get('drops')
  @ZodResponse({ type: GameEventListDto })
  drops() {
    return this.events.activeDrops();
  }
}
