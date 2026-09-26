import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL, ViewerCacheInterceptor } from '../../common/cache';
import { CacheByViewer, OptionalUserId } from '../../common/decorators';
import {
  AchievementsCatalogDto,
  AchievementsQueryDto,
  CollectionParamsDto,
  CollectorsDto,
  CollectorsQueryDto,
  PlayerCollectionDto,
  TankRarityDto,
  TankRarityQueryDto
} from './dto';
import { AchievementCatalogService, CollectorsService, TankRarityService } from './services';

@ApiTags('achievements')
@AllowAnonymous()
@UseInterceptors(ViewerCacheInterceptor)
@Controller('achievements')
export class AchievementsRarityController {
  constructor(
    private readonly catalog: AchievementCatalogService,
    private readonly tanks: TankRarityService,
    private readonly collectors: CollectorsService
  ) {}

  @Get()
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: AchievementsCatalogDto })
  list(@Query() query: AchievementsQueryDto) {
    return this.catalog.catalog(query);
  }

  @Get('tanks')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TankRarityDto })
  tankRarity(@Query() query: TankRarityQueryDto) {
    return this.tanks.list(query);
  }

  @Get('leaderboard')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: CollectorsDto })
  leaderboard(@Query() query: CollectorsQueryDto) {
    return this.collectors.leaderboard(query);
  }

  @Get('players/:accountId')
  @CacheTTL(CACHE_TTL.player)
  @CacheByViewer()
  @ZodResponse({ type: PlayerCollectionDto })
  player(@Param() { accountId }: CollectionParamsDto, @OptionalUserId() viewerUserId: string | null) {
    return this.collectors.player({ accountId: BigInt(accountId), viewerUserId });
  }
}
