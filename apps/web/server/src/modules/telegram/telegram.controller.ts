import type { Update } from 'grammy/types';

import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { WEBHOOK } from './config';
import { TelegramBotService } from './services';

@ApiExcludeController()
@Controller(WEBHOOK.path)
export class TelegramController {
  constructor(private readonly bot: TelegramBotService) {}

  @AllowAnonymous()
  @SkipThrottle()
  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Body() update: Update, @Headers(WEBHOOK.secretHeader) secret: string | undefined): Promise<void> {
    await this.bot.handleWebhook({ update, secret });
  }
}
