import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CACHE_TTL } from '../../common/cache';
import { TechTreeDto, TechTreeParamsDto } from './dto';
import { TechTreeService } from './services';

@ApiTags('tanks')
@AllowAnonymous()
@UseInterceptors(CacheInterceptor)
@Controller('tree')
export class TreeController {
  constructor(private readonly trees: TechTreeService) {}

  @Get(':nation')
  @CacheTTL(CACHE_TTL.reference)
  @ZodResponse({ type: TechTreeDto })
  tree(@Param() { nation }: TechTreeParamsDto) {
    return this.trees.tree(nation);
  }
}
