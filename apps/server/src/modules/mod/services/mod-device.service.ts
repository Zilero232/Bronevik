import { HttpStatus, Injectable } from '@nestjs/common';

import type { AuthenticatedDevice, AuthenticateInput, ModDeviceView, RevokeDeviceInput } from '../mod.types';

import { AppNotFoundException, ModException } from '../../../common/exceptions';
import { toIso, verifySignatureHeader } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { deviceSecret, matchesSecretHash } from '../lib';

@Injectable()
export class ModDeviceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async authenticate({ deviceId, signature, rawBody }: AuthenticateInput): Promise<AuthenticatedDevice> {
    const device = deviceId ? await this.prisma.modDevice.findUnique({ where: { id: deviceId } }) : null;

    if (!device || device.accountId === null) {
      throw new ModException({ status: HttpStatus.UNAUTHORIZED, error: 'unknown_device' });
    }

    if (device.revokedAt) {
      throw new ModException({ status: HttpStatus.FORBIDDEN, error: 'device_revoked' });
    }

    const secret = deviceSecret({ deviceId: device.id, serverSecret: this.config.get('MOD_INGEST_SECRET') });

    if (
      !rawBody ||
      !matchesSecretHash({ secret, hash: device.secretHash }) ||
      !verifySignatureHeader({ header: signature, key: secret, body: rawBody })
    ) {
      throw new ModException({ status: HttpStatus.UNAUTHORIZED, error: 'bad_signature' });
    }

    return { ...device, accountId: device.accountId };
  }

  async list(userId: string): Promise<ModDeviceView[]> {
    const devices = await this.prisma.modDevice.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    return devices.map((device) => ({
      id: device.id,
      accountId: device.accountId === null ? null : Number(device.accountId),
      name: device.name,
      modVersion: device.modVersion,
      gameVersion: device.gameVersion,
      lastSeenAt: toIso(device.lastSeenAt),
      revokedAt: toIso(device.revokedAt),
      createdAt: device.createdAt.toISOString()
    }));
  }

  async revoke({ userId, deviceId }: RevokeDeviceInput): Promise<void> {
    const revoked = await this.prisma.modDevice.updateMany({ where: { id: deviceId, userId, revokedAt: null }, data: { revokedAt: new Date() } });

    if (revoked.count === 0) {
      throw new AppNotFoundException('MOD_DEVICE_INVALID', 'No such active device');
    }
  }
}
