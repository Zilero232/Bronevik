import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';

import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { ModException } from '../../common/exceptions';
import { BIND_CODE, MOD_DEVICE, MOD_INGEST } from './config';
import { BindCodeDto, BindCodeInputDto, BindRequestDto, BindResponseDto, DeviceParamsDto, IngestResponseDto, ModDevicesDto } from './dto';
import { ingestBatchSchema } from './lib';
import { ModBindService, ModDeviceService, ModIngestService } from './services';

@ApiTags('mod')
@Controller('mod')
export class ModController {
  constructor(
    private readonly binding: ModBindService,
    private readonly devices: ModDeviceService,
    private readonly ingestion: ModIngestService
  ) {}

  @Post('bind-code')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: BindCodeDto })
  issueCode(@CurrentUserId() userId: string, @Body() { accountId }: BindCodeInputDto) {
    return this.binding.issueCode({ userId, accountId });
  }

  @AllowAnonymous()
  @Throttle({ default: BIND_CODE.throttle })
  @Post('bind')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BindRequestDto })
  @ZodResponse({ type: BindResponseDto })
  bind(@Body() body: unknown) {
    return this.binding.bind(body);
  }

  @AllowAnonymous()
  @Throttle({ default: MOD_INGEST.throttle })
  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: IngestResponseDto })
  async ingest(
    @Req() request: RawBodyRequest<Request>,
    @Res({ passthrough: true }) response: Response,
    @Headers(MOD_DEVICE.header) deviceId: string | undefined,
    @Headers(MOD_DEVICE.signatureHeader) signature: string | undefined
  ) {
    const device = await this.devices.authenticate({ deviceId, signature, rawBody: request.rawBody });
    const parsed = ingestBatchSchema.safeParse(request.body);

    if (!parsed.success) {
      throw new ModException({ status: HttpStatus.BAD_REQUEST, error: 'invalid_payload', message: parsed.error.issues[0]?.message });
    }

    if (parsed.data.device_id !== device.id || BigInt(parsed.data.account_id) !== device.accountId) {
      throw new ModException({ status: HttpStatus.FORBIDDEN, error: 'account_mismatch' });
    }

    const result = await this.ingestion.ingest({ device, batch: parsed.data });

    if (result.accepted === 0 && result.duplicates === parsed.data.events.length) {
      response.status(HttpStatus.CONFLICT);
    }

    return result;
  }

  @Get('devices')
  @ZodResponse({ type: ModDevicesDto })
  list(@CurrentUserId() userId: string) {
    return this.devices.list(userId);
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@CurrentUserId() userId: string, @Param() { id }: DeviceParamsDto) {
    await this.devices.revoke({ userId, deviceId: id });
  }
}
