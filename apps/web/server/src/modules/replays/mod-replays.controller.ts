import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { modReplayStatusRequestSchema } from '@otmetki/schemas';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ModDeviceService } from '../mod';
import { MOD_REPLAY_STATUS } from './config';
import { ModReplayStatusesDto, ModReplayStatusRequestDto } from './dto';
import { ReplayStatusService } from './services';

@ApiTags('mod')
@AllowAnonymous()
@Throttle({ default: MOD_REPLAY_STATUS.throttle })
@Controller('mod/me')
export class ModReplaysController {
  constructor(
    private readonly devices: ModDeviceService,
    private readonly statuses: ReplayStatusService
  ) {}

  @Post('replays')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ModReplayStatusRequestDto })
  @ZodResponse({ type: ModReplayStatusesDto })
  async statusesOf(@Req() request: RawBodyRequest<Request>) {
    const { device, body } = await this.devices.authenticateBody({ request, schema: modReplayStatusRequestSchema });

    return this.statuses.forDevice({ device, replayIds: body.replay_ids });
  }
}
