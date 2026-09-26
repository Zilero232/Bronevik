import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Header, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { ARMOR_VIEWER } from '../../config';
import {
  TankArmorDto,
  TankDetailDto,
  TankDetailQueryDto,
  TankLookupParamsDto,
  TankParamsDto,
  TankPatchesDto,
  TankStatsPageDto,
  TankStatsQueryDto,
  TankTrendDto,
  TankTrendQueryDto,
  TierListDto,
  TierListQueryDto,
  TopPlayersDto,
  TopPlayersQueryDto
} from './dto';
import {
  TankArmorService,
  TankDetailService,
  TankPatchesService,
  TankStatsService,
  TankTrendService,
  TierListService,
  TopPlayersService
} from './services';

@ApiTags('tanks')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('tanks')
export class TanksController {
  constructor(
    private readonly stats: TankStatsService,
    private readonly tierLists: TierListService,
    private readonly details: TankDetailService,
    private readonly topPlayers: TopPlayersService,
    private readonly trends: TankTrendService,
    private readonly patchNotes: TankPatchesService,
    private readonly armorModels: TankArmorService
  ) {}

  @Get()
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TankStatsPageDto })
  list(@Query() query: TankStatsQueryDto) {
    return this.stats.list(query);
  }

  @Get('tier-list')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TierListDto })
  tierList(@Query() query: TierListQueryDto) {
    return this.tierLists.tierList(query);
  }

  @Get(':id/top-players')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TopPlayersDto })
  async top(@Param() { id }: TankParamsDto, @Query() query: TopPlayersQueryDto) {
    const tankId = await this.details.resolve(String(id));

    return this.topPlayers.top({ tankId, query });
  }

  @Get(':id/trend')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TankTrendDto })
  async trend(@Param() { id }: TankParamsDto, @Query() query: TankTrendQueryDto) {
    const tankId = await this.details.resolve(String(id));

    return this.trends.trend({ tankId, query });
  }

  @Get(':id/patches')
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: TankPatchesDto })
  async patches(@Param() { id }: TankParamsDto) {
    const tankId = await this.details.resolve(String(id));

    return this.patchNotes.patches(tankId);
  }

  @Get(':idOrSlug/armor')
  @CacheTTL(CACHE_TTL.reference)
  @Header('Cache-Control', ARMOR_VIEWER.cacheControl)
  @ZodResponse({ type: TankArmorDto })
  async armor(@Param() { idOrSlug }: TankLookupParamsDto) {
    return this.armorModels.armor(await this.details.resolve(idOrSlug));
  }

  @Get(':idOrSlug')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: TankDetailDto })
  detail(@Param() { idOrSlug }: TankLookupParamsDto, @Query() query: TankDetailQueryDto) {
    return this.details.detail({ idOrSlug, query });
  }
}
