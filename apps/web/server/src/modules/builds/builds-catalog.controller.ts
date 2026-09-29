import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { ViewerCacheInterceptor } from '../../common/interceptors';
import { BuildsCatalogDto, BuildsCatalogQueryDto } from './dto';
import { BuildsCatalogService } from './services';

@ApiTags('builds')
@AllowAnonymous()
@Controller('builds')
export class BuildsCatalogController {
  constructor(private readonly catalog: BuildsCatalogService) {}

  @Get()
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: BuildsCatalogDto })
  list(@Query() query: BuildsCatalogQueryDto) {
    return this.catalog.catalog(query);
  }
}
