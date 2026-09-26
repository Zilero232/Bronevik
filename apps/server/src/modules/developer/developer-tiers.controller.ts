import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ApiTiersDto } from './dto';
import { ApiTierService } from './services';

@ApiTags('developer')
@Controller('developer')
export class DeveloperTiersController {
  constructor(private readonly tiers: ApiTierService) {}

  @AllowAnonymous()
  @Get('tiers')
  @ZodResponse({ type: ApiTiersDto })
  list() {
    return this.tiers.tiers();
  }
}
