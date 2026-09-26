import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { MissionCampaignsDto, MissionOperationDto, MissionOperationParamsDto, MissionParamsDto, MissionTanksDto, MissionTanksQueryDto } from './dto';
import { MissionCatalogService, MissionTanksService } from './services';

@ApiTags('missions')
@AllowAnonymous()
@Controller('missions')
export class MissionsController {
  constructor(
    private readonly catalog: MissionCatalogService,
    private readonly tanks: MissionTanksService
  ) {}

  @Get()
  @ZodResponse({ type: MissionCampaignsDto })
  campaigns() {
    return this.catalog.campaigns();
  }

  @Get(':id/tanks')
  @ZodResponse({ type: MissionTanksDto })
  missionTanks(@Param() { id }: MissionParamsDto, @Query() query: MissionTanksQueryDto) {
    return this.tanks.tanks({ ...query, questId: id });
  }

  @Get(':campaign/:operation')
  @ZodResponse({ type: MissionOperationDto })
  operation(@Param() params: MissionOperationParamsDto) {
    return this.catalog.operation(params);
  }
}
