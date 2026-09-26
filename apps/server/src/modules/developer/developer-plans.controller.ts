import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ApiPlansDto } from './dto';
import { DeveloperPlanService } from './services';

@ApiTags('developer')
@Controller('developer')
export class DeveloperPlansController {
  constructor(private readonly plans: DeveloperPlanService) {}

  @AllowAnonymous()
  @Get('plans')
  @ZodResponse({ type: ApiPlansDto })
  list() {
    return this.plans.plans();
  }
}
