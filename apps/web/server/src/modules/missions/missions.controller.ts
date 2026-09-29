import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { ViewerCacheInterceptor } from '../../common/interceptors';
import { MissionCampaignsDto, MissionOperationDto, MissionOperationParamsDto, MissionParamsDto, MissionTanksDto, MissionTanksQueryDto } from './dto';
import { MissionCatalogService, MissionTanksService } from './services';

@ApiTags('missions')
@AllowAnonymous()
@UseInterceptors(ViewerCacheInterceptor)
@Controller('missions')
export class MissionsController {
  constructor(
    private readonly catalog: MissionCatalogService,
    private readonly tanks: MissionTanksService
  ) {}

  @Get()
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: MissionCampaignsDto })
  campaigns() {
    return this.catalog.campaigns();
  }

  @Get(':id/tanks')
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: MissionTanksDto })
  missionTanks(@Param() { id }: MissionParamsDto, @Query() query: MissionTanksQueryDto) {
    return this.tanks.tanks({ ...query, questId: id });
  }

  @Get(':campaign/:operation')
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: MissionOperationDto })
  operation(@Param() params: MissionOperationParamsDto) {
    return this.catalog.operation(params);
  }
}
