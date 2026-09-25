import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { InboxPageDto, InboxQueryDto, MarkReadDto, MarkReadResultDto, PushKeyDto, PushSubscriptionDto, PushUnsubscribeDto } from './dto';
import { InboxService, PushSubscriptionsService } from './services';

@ApiTags('notifications')
@Controller()
export class NotificationsController {
  constructor(
    private readonly inbox: InboxService,
    private readonly push: PushSubscriptionsService
  ) {}

  @Get('me/inbox')
  @ZodResponse({ type: InboxPageDto })
  list(@CurrentUserId() userId: string, @Query() { limit, before }: InboxQueryDto) {
    return this.inbox.list({ userId, limit, before });
  }

  @Post('me/inbox/read')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: MarkReadResultDto })
  async markRead(@CurrentUserId() userId: string, @Body() { ids }: MarkReadDto) {
    return { updated: await this.inbox.markRead({ userId, ids }) };
  }

  @AllowAnonymous()
  @Get('notifications/push/key')
  @ZodResponse({ type: PushKeyDto })
  pushKey() {
    return this.push.publicKey();
  }

  @Post('me/push')
  @HttpCode(HttpStatus.NO_CONTENT)
  async subscribe(@CurrentUserId() userId: string, @Body() body: PushSubscriptionDto, @Headers('user-agent') userAgent: string | undefined) {
    await this.push.subscribe({ userId, ...body, userAgent: userAgent ?? null });
  }

  @Delete('me/push')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(@CurrentUserId() userId: string, @Body() { endpoint }: PushUnsubscribeDto) {
    await this.push.unsubscribe({ userId, endpoint });
  }
}
