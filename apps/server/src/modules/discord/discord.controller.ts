import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { DiscordStatusDto } from './dto';
import { DiscordStatusService } from './services';

@ApiTags('discord')
@Controller('discord')
export class DiscordController {
  constructor(private readonly statuses: DiscordStatusService) {}

  @AllowAnonymous()
  @Get('status')
  @ZodResponse({ type: DiscordStatusDto })
  status() {
    return this.statuses.status();
  }
}
