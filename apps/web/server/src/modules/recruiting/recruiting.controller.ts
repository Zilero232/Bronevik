import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { IdParamsDto } from '../community-core';
import { RECRUITING_KIND_TO_DB } from './config';
import { CreateRecruitingDto, RecruitingPageDto, RecruitingPostDto, RecruitingQueryDto } from './dto';
import { RecruitingService } from './services';

@ApiTags('community')
@Controller('community/recruiting')
export class RecruitingController {
  constructor(private readonly recruiting: RecruitingService) {}

  @AllowAnonymous()
  @Get()
  @ZodResponse({ type: RecruitingPageDto })
  listRecruiting(@Query() { kind, ...query }: RecruitingQueryDto) {
    return this.recruiting.list({ ...query, kind: kind ? RECRUITING_KIND_TO_DB[kind] : undefined });
  }

  @Post()
  @ZodResponse({ type: RecruitingPostDto, status: HttpStatus.CREATED })
  createRecruiting(@CurrentUserId() userId: string, @Body() { kind, ...body }: CreateRecruitingDto) {
    return this.recruiting.create({ ...body, kind: RECRUITING_KIND_TO_DB[kind], userId });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async closeRecruiting(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    await this.recruiting.close({ id, userId });
  }
}
