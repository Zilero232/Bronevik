import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import {
  MoeHistoryBatchDto,
  MoeHistoryBatchQueryDto,
  MoeHistoryDto,
  MoeHistoryFiltersDto,
  MoeHistoryParamsDto,
  MoePageDto,
  MoeProjectionDto,
  MoeProjectionInputDto,
  MoeQueryDto
} from './dto';
import { MoeTableService, ProjectionService } from './services';

@ApiTags('marks')
@AllowAnonymous()
@Controller('marks')
export class MarksController {
  constructor(
    private readonly table: MoeTableService,
    private readonly projection: ProjectionService
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: MoePageDto })
  list(@Query() query: MoeQueryDto) {
    return this.table.table(query);
  }

  @Get('history')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: MoeHistoryBatchDto })
  historyBatch(@Query() query: MoeHistoryBatchQueryDto) {
    return this.table.historyBatch(query);
  }

  @Get(':tankId/history')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: MoeHistoryDto })
  history(@Param() { tankId }: MoeHistoryParamsDto, @Query() filters: MoeHistoryFiltersDto) {
    return this.table.history({ tankId, ...filters });
  }

  @Post('projection')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: MoeProjectionDto })
  project(@Body() input: MoeProjectionInputDto) {
    return this.projection.project(input);
  }
}
