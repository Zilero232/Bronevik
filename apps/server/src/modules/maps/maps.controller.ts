import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { MapDetailDto, MapListDto, MapParamsDto, MapsQueryDto } from './dto';
import { MapsService } from './services';

@ApiTags('maps')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('maps')
export class MapsController {
  constructor(private readonly maps: MapsService) {}

  @Get()
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: MapListDto })
  list(@Query() query: MapsQueryDto) {
    return this.maps.list(query);
  }

  @Get(':idOrSlug')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: MapDetailDto })
  detail(@Param() { idOrSlug }: MapParamsDto) {
    return this.maps.detail(idOrSlug);
  }
}
