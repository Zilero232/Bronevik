import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { VehicleCatalogDto, VehicleFilterDto } from './dto';
import { VehicleListService } from './services';

@ApiTags('tanks')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehicleListService) {}

  @Get()
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: VehicleCatalogDto })
  list(@Query() filter: VehicleFilterDto) {
    return this.vehicles.list(filter);
  }
}
