import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { TankDetailService } from '../tanks';
import { TankMathDto, TankMathParamsDto } from './dto';
import { TankMathService } from './services';

@ApiTags('tank-math')
@AllowAnonymous()
@Controller('tank-math')
export class TankMathController {
  constructor(
    private readonly tanks: TankDetailService,
    private readonly math: TankMathService
  ) {}

  @Get(':tankId')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: TankMathDto })
  async get(@Param() { tankId }: TankMathParamsDto) {
    return this.math.inputs(await this.tanks.resolve(String(tankId)));
  }
}
