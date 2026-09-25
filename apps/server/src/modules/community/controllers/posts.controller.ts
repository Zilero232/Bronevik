import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../../common/decorators';
import {
  CreatePlatoonDto,
  CreateRecruitingDto,
  IdParamsDto,
  PlatoonPageDto,
  PlatoonPostDto,
  PlatoonQueryDto,
  RecruitingPageDto,
  RecruitingPostDto,
  RecruitingQueryDto
} from '../dto';
import { RECRUITING_KIND_TO_DB } from '../lib';
import { PlatoonService, RecruitingService } from '../services';

@ApiTags('community')
@Controller('community')
export class PostsController {
  constructor(
    private readonly platoons: PlatoonService,
    private readonly recruiting: RecruitingService
  ) {}

  @AllowAnonymous()
  @Get('platoons')
  @ZodResponse({ type: PlatoonPageDto })
  listPlatoons(@Query() query: PlatoonQueryDto) {
    return this.platoons.list(query);
  }

  @Post('platoons')
  @ZodResponse({ type: PlatoonPostDto, status: HttpStatus.CREATED })
  createPlatoon(@CurrentUserId() userId: string, @Body() body: CreatePlatoonDto) {
    return this.platoons.create({ ...body, userId });
  }

  @Delete('platoons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async closePlatoon(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    await this.platoons.close({ id, userId });
  }

  @AllowAnonymous()
  @Get('recruiting')
  @ZodResponse({ type: RecruitingPageDto })
  listRecruiting(@Query() { kind, ...query }: RecruitingQueryDto) {
    return this.recruiting.list({ ...query, kind: kind ? RECRUITING_KIND_TO_DB[kind] : undefined });
  }

  @Post('recruiting')
  @ZodResponse({ type: RecruitingPostDto, status: HttpStatus.CREATED })
  createRecruiting(@CurrentUserId() userId: string, @Body() { kind, ...body }: CreateRecruitingDto) {
    return this.recruiting.create({ ...body, kind: RECRUITING_KIND_TO_DB[kind], userId });
  }

  @Delete('recruiting/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async closeRecruiting(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    await this.recruiting.close({ id, userId });
  }
}
