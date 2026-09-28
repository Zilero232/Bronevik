import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import type { UsageActor } from './usage.types';

import { USAGE_ROUTE } from './config';
import { CurrentUsageActor, MeteredUsage } from './decorators';
import { UsageDto } from './dto';
import { UsageMeterService } from './services';

@ApiTags('me')
@AllowAnonymous()
@Controller('me/usage')
export class UsageController {
  constructor(private readonly meters: UsageMeterService) {}

  @Get()
  @MeteredUsage()
  @Header('Cache-Control', USAGE_ROUTE.cacheControl)
  @ZodResponse({ type: UsageDto })
  usage(@CurrentUsageActor() actor: UsageActor) {
    return this.meters.usage(actor);
  }
}
