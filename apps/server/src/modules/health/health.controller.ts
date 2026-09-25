import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { HealthDto } from './dto';
import { HealthService } from './services';

@ApiTags('health')
@AllowAnonymous()
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ZodResponse({ type: HealthDto })
  async check() {
    return this.health.check();
  }
}
