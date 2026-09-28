import { Controller, Get, Header, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import type { UsageActor } from '../usage';

import { ARMOR_VIEWER } from '../../config';
import { CurrentUsageActor, MeteredUsage } from '../usage';
import { TankArmorDto, TankLookupParamsDto } from './dto';
import { TankArmorService } from './services';

@ApiTags('tanks')
@AllowAnonymous()
@Controller('tanks')
export class TankArmorController {
  constructor(private readonly armorModels: TankArmorService) {}

  @Get(':idOrSlug/armor')
  @MeteredUsage()
  @Header('Cache-Control', ARMOR_VIEWER.cacheControl)
  @ZodResponse({ type: TankArmorDto })
  armor(@Param() { idOrSlug }: TankLookupParamsDto, @CurrentUsageActor() actor: UsageActor) {
    return this.armorModels.open({ idOrSlug, actor });
  }
}
