import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { BEST_BATTLES } from './config';
import { BestBattlesFacetsDto, BestBattlesFacetsQueryDto, BestBattlesPageDto, BestBattlesQueryDto } from './dto';
import { BestBattlesFacetsService, BestBattlesFeedService } from './services';

@ApiTags('best-battles')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('best-battles')
export class BestBattlesController {
  constructor(
    private readonly feed: BestBattlesFeedService,
    private readonly facets: BestBattlesFacetsService
  ) {}

  @Get()
  @CacheTTL(BEST_BATTLES.feedCacheMs)
  @ZodResponse({ type: BestBattlesPageDto })
  list(@Query() query: BestBattlesQueryDto) {
    return this.feed.page({ query, now: new Date() });
  }

  @Get('facets')
  @CacheTTL(BEST_BATTLES.facetsCacheMs)
  @ZodResponse({ type: BestBattlesFacetsDto })
  facetsOf(@Query() query: BestBattlesFacetsQueryDto) {
    return this.facets.facets({ query, now: new Date() });
  }
}
