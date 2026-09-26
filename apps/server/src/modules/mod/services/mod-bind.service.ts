import { HttpStatus, Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { isObjectType, isString } from 'remeda';

import type { BindResponse } from '../lib';
import type { BindCode, BindCodeInput } from '../mod.types';

import { AppForbiddenException, ModException } from '../../../common/exceptions';
import { randomCode } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { BIND_CODE } from '../config';
import { bindCodePattern, bindRequestSchema, deviceSecret, hashSecret, newDeviceId, normalizeBindCode } from '../lib';

@Injectable()
export class ModBindService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async issueCode({ userId, accountId }: BindCodeInput): Promise<BindCode> {
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, orderBy: [{ isPrimary: 'desc' }, { linkedAt: 'asc' }] });

    if (links.length === 0) {
      throw new AppForbiddenException('FORBIDDEN', 'Link a Lesta account before binding the mod');
    }

    const link = accountId === undefined ? null : links.find((candidate) => candidate.accountId === BigInt(accountId));

    if (accountId !== undefined && !link) {
      throw new AppForbiddenException('FORBIDDEN', 'This Lesta account is not linked to you');
    }

    const code = randomCode(BIND_CODE);
    const expiresAt = addMinutes(new Date(), BIND_CODE.ttlMinutes);

    await this.prisma.$transaction([
      this.prisma.modBindCode.deleteMany({ where: { userId, usedAt: null } }),
      this.prisma.modBindCode.create({ data: { code, userId, accountId: link?.accountId ?? null, expiresAt } })
    ]);

    return { code, accountId: link ? Number(link.accountId) : null, expiresAt: expiresAt.toISOString() };
  }

  async bind(body: unknown): Promise<BindResponse> {
    const rawCode = isObjectType(body) && 'code' in body && isString(body.code) ? normalizeBindCode(body.code) : null;

    if (rawCode === null || !bindCodePattern.test(rawCode)) {
      throw new ModException({ status: HttpStatus.BAD_REQUEST, error: 'invalid_code' });
    }

    const parsed = bindRequestSchema.safeParse({ ...(isObjectType(body) ? body : {}), code: rawCode });

    if (!parsed.success) {
      throw new ModException({ status: HttpStatus.BAD_REQUEST, error: 'invalid_code', message: 'Malformed bind request' });
    }

    const request = parsed.data;
    const stored = await this.prisma.modBindCode.findUnique({ where: { code: request.code } });

    if (!stored) {
      throw new ModException({ status: HttpStatus.NOT_FOUND, error: 'code_not_found' });
    }

    if (stored.usedAt) {
      throw new ModException({ status: HttpStatus.CONFLICT, error: 'code_used' });
    }

    if (stored.expiresAt <= new Date()) {
      throw new ModException({ status: HttpStatus.GONE, error: 'code_expired' });
    }

    const accountId = BigInt(request.account_id);
    const link = await this.prisma.userLestaAccount.findFirst({ where: { userId: stored.userId, accountId }, include: { player: true } });

    if (!link || (stored.accountId !== null && stored.accountId !== accountId)) {
      throw new ModException({ status: HttpStatus.FORBIDDEN, error: 'account_mismatch' });
    }

    const claimed = await this.prisma.modBindCode.updateMany({ where: { code: request.code, usedAt: null }, data: { usedAt: new Date() } });

    if (claimed.count === 0) {
      throw new ModException({ status: HttpStatus.CONFLICT, error: 'code_used' });
    }

    const deviceId = newDeviceId();
    const secret = deviceSecret({ deviceId, serverSecret: this.config.get('MOD_INGEST_SECRET') });

    await this.prisma.$transaction([
      this.prisma.modDevice.create({
        data: {
          id: deviceId,
          userId: stored.userId,
          accountId,
          secretHash: hashSecret(secret),
          modVersion: request.mod_version,
          gameVersion: request.client_version
        }
      }),
      this.prisma.modBindCode.update({ where: { code: request.code }, data: { deviceId } })
    ]);

    return { device_id: deviceId, secret, account_id: request.account_id, nickname: link.player.nickname };
  }
}
