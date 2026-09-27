import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { ComparePlayersQueryDto, CompareTanksQueryDto, PlayerComparisonDto, TankComparisonDto } from './dto';
import { PlayerCompareService, TankCompareService } from './services';

@ApiTags('compare')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('compare')
export class CompareController {
  constructor(
    private readonly players: PlayerCompareService,
    private readonly tanks: TankCompareService
  ) {}

  @Get('players')
  @CacheTTL(CACHE_TTL.player)
  @ZodResponse({ type: PlayerComparisonDto })
  comparePlayers(@Query() { ids, accountIds }: ComparePlayersQueryDto) {
    return this.players.compare({ accountIds: accountIds ?? ids ?? [] });
  }

  @Get('tanks')
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: TankComparisonDto })
  compareTanks(@Query() { ids, tankIds, profiles }: CompareTanksQueryDto) {
    return this.tanks.compare({ tankIds: tankIds ?? ids ?? [], profiles });
  }
}
