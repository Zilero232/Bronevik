import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { RequiresPlus } from '../billing';
import {
  MissionGarageDto,
  MissionParamsDto,
  MissionPlanDto,
  MissionPlanQueryDto,
  MissionProgressDto,
  MissionProgressItemDto,
  UpdateMissionProgressDto
} from './dto';
import { MissionPlanService, MissionProgressService, MissionTanksService } from './services';

@ApiTags('me')
@Controller('me/missions')
export class MeMissionsController {
  constructor(
    private readonly progress: MissionProgressService,
    private readonly tanks: MissionTanksService,
    private readonly plans: MissionPlanService
  ) {}

  @Get('progress')
  @ZodResponse({ type: MissionProgressDto })
  listProgress(@CurrentUserId() userId: string) {
    return this.progress.list(userId);
  }

  @Put('progress')
  @ZodResponse({ type: MissionProgressItemDto })
  updateProgress(@CurrentUserId() userId: string, @Body() body: UpdateMissionProgressDto) {
    return this.progress.update({ ...body, userId });
  }

  @Get('plan')
  @RequiresPlus('progression')
  @ZodResponse({ type: MissionPlanDto })
  plan(@CurrentUserId() userId: string, @Query() { operation }: MissionPlanQueryDto) {
    return this.plans.plan({ userId, operationId: operation });
  }

  @Get(':id/garage')
  @ZodResponse({ type: MissionGarageDto })
  garage(@CurrentUserId() userId: string, @Param() { id }: MissionParamsDto) {
    return this.tanks.garage({ userId, questId: id });
  }
}
