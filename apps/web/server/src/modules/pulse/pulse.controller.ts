import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { PulseDto } from './dto';
import { PulseService } from './services';

@ApiTags('pulse')
@AllowAnonymous()
@Controller('pulse')
export class PulseController {
  constructor(private readonly pulse: PulseService) {}

  @Get()
  @ZodResponse({ type: PulseDto })
  get() {
    return this.pulse.view(new Date());
  }
}
