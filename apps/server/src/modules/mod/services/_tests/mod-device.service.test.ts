import { HttpStatus } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ModDevice } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';

import { AppNotFoundException } from '../../../../common/exceptions';
import { deviceSecret, hashSecret } from '../../lib';
import { ModDeviceService } from '../mod-device.service';

const SERVER_SECRET = 'server-secret-for-tests';
const DEVICE_ID = 'dev_test';
const BODY = Buffer.from('{"events":[]}');

const secret = deviceSecret({ deviceId: DEVICE_ID, serverSecret: SERVER_SECRET });

const signatureOf = ({ key, body }: { key: string; body: Buffer }) => `sha256=${createHmac('sha256', key).update(body).digest('hex')}`;

const device = (overrides: Partial<ModDevice> = {}): ModDevice => ({
  id: DEVICE_ID,
  userId: 'user',
  accountId: 12345n,
  name: null,
  secretHash: hashSecret(secret),
  modVersion: '1.0.0',
  gameVersion: '1.30.0',
  lastSeenAt: null,
  revokedAt: null,
  createdAt: new Date('2026-05-01T12:00:00.000Z'),
  ...overrides
});

const createService = ({ stored = device(), serverSecret = SERVER_SECRET }: { stored?: ModDevice | null; serverSecret?: string } = {}) => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(serverSecret);
  prisma.modDevice.findUnique.mockResolvedValue(stored);

  return { service: new ModDeviceService(prisma, config), prisma };
};

const validSignature = signatureOf({ key: secret, body: BODY });

describe('ModDeviceService.identify', () => {
  it('rejects a request without a device header without querying the database', async () => {
    const { service, prisma } = createService();

    await expect(service.identify({ deviceId: undefined, signature: validSignature })).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
      response: { error: 'unknown_device' }
    });

    expect(prisma.modDevice.findUnique).not.toHaveBeenCalled();
  });

  it('rejects a device id that was never bound', async () => {
    const { service } = createService({ stored: null });

    await expect(service.identify({ deviceId: DEVICE_ID, signature: validSignature })).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
      response: { error: 'unknown_device' }
    });
  });

  it('rejects a device that has lost its account', async () => {
    const { service } = createService({ stored: device({ accountId: null }) });

    await expect(service.identify({ deviceId: DEVICE_ID, signature: validSignature })).rejects.toMatchObject({
      response: { error: 'unknown_device' }
    });
  });

  it('refuses a revoked device even with valid credentials', async () => {
    const { service } = createService({ stored: device({ revokedAt: new Date() }) });

    await expect(service.identify({ deviceId: DEVICE_ID, signature: validSignature })).rejects.toMatchObject({
      status: HttpStatus.FORBIDDEN,
      response: { error: 'device_revoked' }
    });
  });

  it('rejects a missing or malformed signature header', async () => {
    const { service } = createService();

    await expect(service.identify({ deviceId: DEVICE_ID, signature: undefined })).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
      response: { error: 'bad_signature' }
    });

    await expect(service.identify({ deviceId: DEVICE_ID, signature: 'sha256=nothex' })).rejects.toMatchObject({
      response: { error: 'bad_signature' }
    });
  });

  it('locks out every bound device once the server secret is rotated', async () => {
    const { service } = createService({ serverSecret: 'rotated-server-secret' });

    await expect(service.identify({ deviceId: DEVICE_ID, signature: validSignature })).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
      response: { error: 'bad_signature' }
    });
  });

  it('returns the device with its account for well-formed credentials', async () => {
    const { service } = createService();

    await expect(service.identify({ deviceId: DEVICE_ID, signature: validSignature })).resolves.toMatchObject({ id: DEVICE_ID, accountId: 12345n });
  });
});

describe('ModDeviceService.authenticate', () => {
  it('accepts a body signed with the device secret', async () => {
    const { service } = createService();

    await expect(service.authenticate({ deviceId: DEVICE_ID, signature: validSignature, rawBody: BODY })).resolves.toMatchObject({ id: DEVICE_ID });
  });

  it('rejects a body that differs from the one signed', async () => {
    const { service } = createService();

    await expect(
      service.authenticate({ deviceId: DEVICE_ID, signature: validSignature, rawBody: Buffer.from('{"events":[1]}') })
    ).rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED, response: { error: 'bad_signature' } });
  });

  it('rejects a body signed with another device secret', async () => {
    const { service } = createService();
    const foreign = signatureOf({ key: deviceSecret({ deviceId: 'dev_other', serverSecret: SERVER_SECRET }), body: BODY });

    await expect(service.authenticate({ deviceId: DEVICE_ID, signature: foreign, rawBody: BODY })).rejects.toMatchObject({
      response: { error: 'bad_signature' }
    });
  });

  it('rejects a request whose raw body was not captured', async () => {
    const { service } = createService();

    await expect(service.authenticate({ deviceId: DEVICE_ID, signature: validSignature, rawBody: undefined })).rejects.toMatchObject({
      response: { error: 'bad_signature' }
    });
  });
});

describe('ModDeviceService.list', () => {
  it('serialises account ids as numbers and keeps unset dates null', async () => {
    const { service, prisma } = createService();
    const seen = new Date('2026-05-02T08:00:00.000Z');

    prisma.modDevice.findMany.mockResolvedValue([device({ lastSeenAt: seen }), device({ id: 'dev_orphan', accountId: null })]);

    const [bound, orphan] = await service.list('user');

    expect(bound).toMatchObject({ accountId: 12345, lastSeenAt: seen.toISOString(), revokedAt: null, createdAt: device().createdAt.toISOString() });
    expect(orphan?.accountId).toBeNull();
  });
});

describe('ModDeviceService.revoke', () => {
  it('revokes only an active device owned by the user', async () => {
    const { service, prisma } = createService();

    prisma.modDevice.updateMany.mockResolvedValue({ count: 1 });

    await service.revoke({ userId: 'user', deviceId: DEVICE_ID });

    expect(prisma.modDevice.updateMany).toHaveBeenCalledWith({
      where: { id: DEVICE_ID, userId: 'user', revokedAt: null },
      data: { revokedAt: expect.any(Date) }
    });
  });

  it('reports not found for a device that is foreign or already revoked', async () => {
    const { service, prisma } = createService();

    prisma.modDevice.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.revoke({ userId: 'user', deviceId: DEVICE_ID })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});
