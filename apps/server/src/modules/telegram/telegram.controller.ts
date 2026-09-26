import type { Update } from 'grammy/types';

import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { timingSafeEqual } from '../../common/lib';
import { AppConfigService } from '../../config';
import { WEBHOOK } from './config';
import { TelegramBotService } from './services';

@ApiExcludeController()
@Controller(WEBHOOK.path)
export class TelegramController {
  constructor(
    private readonly bot: TelegramBotService,
    private readonly config: AppConfigService
  ) {}

  @AllowAnonymous()
  @SkipThrottle()
  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Body() update: Update, @Headers(WEBHOOK.secretHeader) secret: string | undefined): Promise<void> {
    const expected = this.config.get('TELEGRAM_WEBHOOK_SECRET');

    if (!expected || !secret || !timingSafeEqual({ left: secret, right: expected })) {
      return;
    }

    await this.bot.handleUpdate(update);
  }
}
