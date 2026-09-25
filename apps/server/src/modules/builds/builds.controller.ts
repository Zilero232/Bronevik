import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { TankDetailService } from '../tanks';
import { BuildOptionsDto, BuildTankParamsDto, LoadoutRequestDto, LoadoutResultDto, PopularBuildsDto, PopularBuildsQueryDto } from './dto';
import { BuildOptionsService, LoadoutService, PopularBuildsService } from './services';

@ApiTags('builds')
@AllowAnonymous()
@Controller('tanks')
export class BuildsController {
  constructor(
    private readonly tanks: TankDetailService,
    private readonly buildOptions: BuildOptionsService,
    private readonly loadouts: LoadoutService,
    private readonly popularBuilds: PopularBuildsService
  ) {}

  @Get(':id/build-options')
  @UseInterceptors(CacheInterceptor)
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

  @Get(':id/builds/popular')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: PopularBuildsDto })
  async popular(@Param() { id }: BuildTankParamsDto, @Query() query: PopularBuildsQueryDto) {
    const tankId = await this.tanks.resolve(String(id));

    return this.popularBuilds.popular({ tankId, query });
  }
}
