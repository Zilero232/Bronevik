import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { RequiresPlus } from '../billing';
import { SupertestAnnouncementDto, SupertestListDto, SupertestMineDto, SupertestParamsDto } from './dto';
import { SupertestQueryService } from './services';

@ApiTags('supertest')
@Controller('supertest')
export class SupertestController {
  constructor(private readonly supertest: SupertestQueryService) {}

  @Get()
  @AllowAnonymous()
  @ZodResponse({ type: SupertestListDto })
  list() {
    return this.supertest.list();
  }

  @Get('mine')
  @RequiresPlus('analytics')
  @ZodResponse({ type: SupertestMineDto })
  mine(@CurrentUserId() userId: string) {
    return this.supertest.mine(userId);
  }

  @Get(':id')
  @AllowAnonymous()
  @ZodResponse({ type: SupertestAnnouncementDto })
  detail(@Param() { id }: SupertestParamsDto) {
    return this.supertest.detail(id);
  }
}
