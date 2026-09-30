import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { OptionalUserId } from '../../common/decorators';
import { ViewerCacheInterceptor } from '../../common/interceptors';
import { RequiresPlus } from '../billing';
import { TankDetailService } from '../tanks';
import { RECOMMENDED_BUILD } from './config';
import {
  BuildAdviceDto,
  BuildHistoryDto,
  BuildOptionsDto,
  BuildTankParamsDto,
  BuildUsageQueryDto,
  LoadoutRequestDto,
  LoadoutResultDto,
  PopularBuildsDto,
  PopularBuildsQueryDto,
  RecommendedBuildDto
} from './dto';
import {
  BuildAdviceService,
  BuildOptionsService,
  BuildUsageService,
  LoadoutService,
  PopularBuildsService,
  RecommendedBuildService
} from './services';

@ApiTags('builds')
@AllowAnonymous()
@Controller('tanks')
export class BuildsController {
  constructor(
    private readonly tanks: TankDetailService,
    private readonly buildOptions: BuildOptionsService,
    private readonly loadouts: LoadoutService,
    private readonly popularBuilds: PopularBuildsService,
    private readonly recommendedBuilds: RecommendedBuildService,
    private readonly usage: BuildUsageService,
    private readonly buildAdvice: BuildAdviceService
  ) {}

  @Get(':id/build-options')
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: BuildOptionsDto })
  async options(@Param() { id }: BuildTankParamsDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.buildOptions.options(tankId);
  }

  @Post(':id/loadout')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: LoadoutResultDto })
  async loadout(@Param() { id }: BuildTankParamsDto, @Body() request: LoadoutRequestDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.loadouts.calculate({ tankId, request });
  }

  @Get(':id/recommended-build')
  @ZodResponse({ type: RecommendedBuildDto })
  async recommended(@Param() { id }: BuildTankParamsDto, @Query() query: BuildUsageQueryDto, @OptionalUserId() viewerUserId: string | null) {
    const tankId = await this.tanks.resolve(String(id));

    return this.recommendedBuilds.recommended({ tankId, query, viewerUserId });
  }

  @Get(':id/build-advice')
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: BuildAdviceDto })
  async advice(@Param() { id }: BuildTankParamsDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.buildAdvice.advice(tankId);
  }

  @Get(':id/recommended-build/history')
  @RequiresPlus(RECOMMENDED_BUILD.plusFeature)
  @ZodResponse({ type: BuildHistoryDto })
  async history(@Param() { id }: BuildTankParamsDto, @Query() query: BuildUsageQueryDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.usage.history({ tankId, query });
  }

  @Get(':id/builds/popular')
  @UseInterceptors(ViewerCacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: PopularBuildsDto })
  async popular(@Param() { id }: BuildTankParamsDto, @Query() query: PopularBuildsQueryDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.popularBuilds.popular({ tankId, query });
  }
}
