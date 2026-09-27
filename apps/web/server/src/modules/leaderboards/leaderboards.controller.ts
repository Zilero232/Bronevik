import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { LeaderboardDto, LeaderboardQueryDto } from './dto';
import { LeaderboardService } from './services';

@ApiTags('leaderboards')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboards: LeaderboardService) {}

  @Get()
  @CacheTTL(CACHE_TTL.server)
  @ZodResponse({ type: LeaderboardDto })
  list(@Query() query: LeaderboardQueryDto) {
    return this.leaderboards.leaderboard(query);
  }
}
