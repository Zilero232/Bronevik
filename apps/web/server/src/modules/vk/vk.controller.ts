import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import type { VkCallbackBody } from './vk.types';

import { timingSafeEqual } from '../../common/lib';
import { AppConfigService } from '../../config';
import { VK_BOT } from './config';
import { VkStatusDto } from './dto';
import { VkBotService, VkStatusService } from './services';

@ApiTags('vk')
@Controller('vk')
export class VkController {
  constructor(
    private readonly bot: VkBotService,
    private readonly statuses: VkStatusService,
    private readonly config: AppConfigService
  ) {}

  @AllowAnonymous()
  @Get('status')
  @ZodResponse({ type: VkStatusDto })
  status() {
    return this.statuses.status();
  }

  @ApiExcludeEndpoint()
  @AllowAnonymous()
  @SkipThrottle()
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'text/plain')
  async callback(@Body() body: VkCallbackBody): Promise<string> {
    if (!this.bot.usesCallback) {
      return VK_BOT.okResponse;
    }

    if (body.type === VK_BOT.confirmationType) {
      return this.config.get('VK_CALLBACK_CONFIRMATION');
    }

    const expected = this.config.get('VK_CALLBACK_SECRET');

    if (typeof body.secret !== 'string' || !timingSafeEqual({ left: body.secret, right: expected })) {
      return VK_BOT.okResponse;
    }

    await this.bot.handleWebhook(body);

    return VK_BOT.okResponse;
  }
}
