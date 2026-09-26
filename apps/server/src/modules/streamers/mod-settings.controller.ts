import type { RawBodyRequest } from '@nestjs/common';
import type { ModDeviceRequest } from '@otmetki/schemas';

import { Controller, Headers, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { modApplyResultSchema, modDeviceRequestSchema, modSettingsExportSchema } from '@otmetki/schemas';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Request } from 'express';
import { ZodResponse } from 'nestjs-zod';

import type { SignedModInput, SignedModResult } from './streamers.types';

import { ModException } from '../../common/exceptions';
import { MOD_DEVICE, ModDeviceService } from '../mod';
import { STREAMERS } from './config';
import { IdParamsDto, ModApplyListDto } from './dto';
import { SettingsShareService } from './services';

@ApiTags('mod')
@AllowAnonymous()
@Throttle({ default: STREAMERS.modThrottle })
@Controller('mod/settings')
export class ModSettingsController {
  constructor(
    private readonly devices: ModDeviceService,
    private readonly shares: SettingsShareService
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async export(
    @Req() request: RawBodyRequest<Request>,
    @Headers(MOD_DEVICE.header) deviceId: string | undefined,
    @Headers(MOD_DEVICE.signatureHeader) signature: string | undefined
  ) {
    const { device, body } = await this.signed({ request, deviceId, signature, schema: modSettingsExportSchema });

    await this.shares.ingestExport({ device, body });
  }

  @Post('apply/poll')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: ModApplyListDto })
  async poll(
    @Req() request: RawBodyRequest<Request>,
    @Headers(MOD_DEVICE.header) deviceId: string | undefined,
    @Headers(MOD_DEVICE.signatureHeader) signature: string | undefined
  ) {
    const { device } = await this.signed({ request, deviceId, signature, schema: modDeviceRequestSchema });

    return this.shares.pendingForDevice(device);
  }

  @Post('apply/:id/result')
  @HttpCode(HttpStatus.NO_CONTENT)
  async result(
    @Req() request: RawBodyRequest<Request>,
    @Param() { id }: IdParamsDto,
    @Headers(MOD_DEVICE.header) deviceId: string | undefined,
    @Headers(MOD_DEVICE.signatureHeader) signature: string | undefined
  ) {
    const { device, body } = await this.signed({ request, deviceId, signature, schema: modApplyResultSchema });

    await this.shares.applyResult({ device, id, status: body.status });
  }

  private async signed<T extends ModDeviceRequest>({ request, deviceId, signature, schema }: SignedModInput<T>): Promise<SignedModResult<T>> {
    const device = await this.devices.authenticate({ deviceId, signature, rawBody: request.rawBody });
    const parsed = schema.safeParse(request.body);

    if (!parsed.success) {
      throw new ModException({ status: HttpStatus.BAD_REQUEST, error: 'invalid_payload', message: parsed.error.issues[0]?.message });
    }

    if (parsed.data.device_id !== device.id || BigInt(parsed.data.account_id) !== device.accountId) {
      throw new ModException({ status: HttpStatus.FORBIDDEN, error: 'account_mismatch' });
    }

    return { device, body: parsed.data };
  }
}
