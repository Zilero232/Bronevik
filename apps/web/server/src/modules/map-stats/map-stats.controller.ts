import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ViewerCacheInterceptor } from '../../common/interceptors';
import { MAP_STATS } from './config';
import { MapQueueDto, MapRotationDto, MapStatsQueryDto } from './dto';
import { MapStatsService } from './services';

@ApiTags('map-stats')
@AllowAnonymous()
@Controller('map-stats')
export class MapStatsController {
  constructor(private readonly stats: MapStatsService) {}

  @Get('rotation')
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(MAP_STATS.rotationCacheMs)
  @ZodResponse({ type: MapRotationDto })
  rotation(@Query() query: MapStatsQueryDto) {
    return this.stats.rotation(query);
  }

  @Get('queue')
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(MAP_STATS.queueCacheMs)
  @ZodResponse({ type: MapQueueDto })
  queue(@Query() query: MapStatsQueryDto) {
    return this.stats.queue({ ...query, now: new Date() });
  }
}
