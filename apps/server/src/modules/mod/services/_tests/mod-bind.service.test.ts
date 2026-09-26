import { HttpStatus } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ModBindCode, Player, UserLestaAccount } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';

import { AppForbiddenException } from '../../../../common/exceptions';
import { BIND_CODE, MOD_DEVICE } from '../../config';
import { bindCodePattern, deviceSecret, hashSecret } from '../../lib';
import { ModBindService } from '../mod-bind.service';

const NOW = new Date('2026-05-01T12:00:00.000Z');
const SERVER_SECRET = 'server-secret-for-tests';
const CODE = 'ABCDEF';
const ACCOUNT_ID = 12345;

const link = (accountId: number, overrides: Partial<UserLestaAccount> = {}) =>
  mock<UserLestaAccount>({ userId: 'user', accountId: BigInt(accountId), isPrimary: false, ...overrides });

const linkWithPlayer = (accountId: number) =>
  mock<UserLestaAccount & { player: Player }>({ userId: 'user', accountId: BigInt(accountId), player: mock<Player>({ nickname: 'Tanker' }) });

const storedCode = (overrides: Partial<ModBindCode> = {}): ModBindCode => ({
  code: CODE,
  userId: 'user',
  accountId: null,
  deviceId: null,
  expiresAt: addMinutes(NOW, BIND_CODE.ttlMinutes),
  usedAt: null,
  createdAt: NOW,
  ...overrides
});

const bindBody = (overrides: Record<string, unknown> = {}) => ({
  code: CODE,
  account_id: ACCOUNT_ID,
  mod_version: '1.0.0',
  client_version: '1.30.0',
  realm: 'RU',
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(SERVER_SECRET);
  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new ModBindService(prisma, config), prisma };
};

const readyToBind = (code: ModBindCode = storedCode()) => {
  const created = createService();

  created.prisma.modBindCode.findUnique.mockResolvedValue(code);
  created.prisma.userLestaAccount.findFirst.mockResolvedValue(linkWithPlayer(ACCOUNT_ID));
  created.prisma.modBindCode.updateMany.mockResolvedValue({ count: 1 });

  return created;
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ModBindService.issueCode', () => {
  it('refuses a user with no linked Lesta account', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([]);

    await expect(service.issueCode({ userId: 'user' })).rejects.toBeInstanceOf(AppForbiddenException);
    expect(prisma.modBindCode.create).not.toHaveBeenCalled();
  });

  it('refuses to bind a code to an account the user has not linked', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([link(ACCOUNT_ID)]);

    await expect(service.issueCode({ userId: 'user', accountId: ACCOUNT_ID + 1 })).rejects.toBeInstanceOf(AppForbiddenException);
    expect(prisma.modBindCode.create).not.toHaveBeenCalled();
  });

  it('issues a code the mod can type back, expiring after the configured ttl', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([link(ACCOUNT_ID)]);

    const issued = await service.issueCode({ userId: 'user' });

    expect(issued.code).toMatch(bindCodePattern);
    expect(issued.expiresAt).toBe(addMinutes(NOW, BIND_CODE.ttlMinutes).toISOString());
    expect(issued.accountId).toBeNull();
  });

  it('replaces the unused codes of the user when issuing a new one', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([link(ACCOUNT_ID)]);

    await service.issueCode({ userId: 'user' });

    expect(prisma.modBindCode.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user', usedAt: null } });
  });

  it('pins the code to the requested linked account', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([link(ACCOUNT_ID + 1), link(ACCOUNT_ID)]);

    const issued = await service.issueCode({ userId: 'user', accountId: ACCOUNT_ID });

    expect(issued.accountId).toBe(ACCOUNT_ID);
    expect(prisma.modBindCode.create).toHaveBeenCalledWith({ data: expect.objectContaining({ accountId: BigInt(ACCOUNT_ID) }) });
  });
});

describe('ModBindService.bind', () => {
  it('rejects a body without a well-formed code before touching the database', async () => {
    const { service, prisma } = createService();

    await expect(service.bind(bindBody({ code: 'I0I0I0' }))).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
      response: { error: 'invalid_code' }
    });

    await expect(service.bind('ABCDEF')).rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST, response: { error: 'invalid_code' } });
    expect(prisma.modBindCode.findUnique).not.toHaveBeenCalled();
  });

  it('rejects a valid code sent with a malformed rest of the request', async () => {
    const { service, prisma } = createService();

    await expect(service.bind(bindBody({ realm: 'EU' }))).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
      response: { error: 'invalid_code' }
    });

    expect(prisma.modBindCode.findUnique).not.toHaveBeenCalled();
  });

  it('accepts a code typed in lower case with separators', async () => {
    const { service, prisma } = readyToBind();

    await service.bind(bindBody({ code: 'abc-def' }));

    expect(prisma.modBindCode.findUnique).toHaveBeenCalledWith({ where: { code: CODE } });
  });

  it('answers not found for an unknown code', async () => {
    const { service, prisma } = createService();

    prisma.modBindCode.findUnique.mockResolvedValue(null);

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND, response: { error: 'code_not_found' } });
  });

  it('refuses to reuse a code that already bound a device', async () => {
    const { service, prisma } = readyToBind(storedCode({ usedAt: NOW }));

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.CONFLICT, response: { error: 'code_used' } });
    expect(prisma.modDevice.create).not.toHaveBeenCalled();
  });

  it('treats a code as expired at the exact expiry instant', async () => {
    const { service, prisma } = readyToBind(storedCode({ expiresAt: NOW }));

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.GONE, response: { error: 'code_expired' } });
    expect(prisma.modDevice.create).not.toHaveBeenCalled();
  });

  it('still accepts a code one millisecond before it expires', async () => {
    const { service } = readyToBind(storedCode({ expiresAt: new Date(NOW.getTime() + 1) }));

    await expect(service.bind(bindBody())).resolves.toMatchObject({ account_id: ACCOUNT_ID });
  });

  it('refuses an account the code owner has not linked', async () => {
    const { service, prisma } = readyToBind();

    prisma.userLestaAccount.findFirst.mockResolvedValue(null);

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.FORBIDDEN, response: { error: 'account_mismatch' } });
    expect(prisma.modBindCode.updateMany).not.toHaveBeenCalled();
  });

  it('refuses a linked account other than the one the code was pinned to', async () => {
    const { service, prisma } = readyToBind(storedCode({ accountId: BigInt(ACCOUNT_ID + 1) }));

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.FORBIDDEN, response: { error: 'account_mismatch' } });
    expect(prisma.modBindCode.updateMany).not.toHaveBeenCalled();
  });

  it('loses gracefully when a concurrent bind claims the code first', async () => {
    const { service, prisma } = readyToBind();

    prisma.modBindCode.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.bind(bindBody())).rejects.toMatchObject({ status: HttpStatus.CONFLICT, response: { error: 'code_used' } });
    expect(prisma.modDevice.create).not.toHaveBeenCalled();
  });

  it('hands the mod a device secret derived from the server secret and stores only its hash', async () => {
    const { service, prisma } = readyToBind();

    const response = await service.bind(bindBody());

    expect(response.device_id.startsWith(MOD_DEVICE.idPrefix)).toBe(true);
    expect(response.secret).toBe(deviceSecret({ deviceId: response.device_id, serverSecret: SERVER_SECRET }));
    expect(response.nickname).toBe('Tanker');

    expect(prisma.modDevice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: response.device_id,
        userId: 'user',
        accountId: BigInt(ACCOUNT_ID),
        secretHash: hashSecret(response.secret)
      })
    });
  });

  it('records which device consumed the code', async () => {
    const { service, prisma } = readyToBind();

    const response = await service.bind(bindBody());

    expect(prisma.modBindCode.update).toHaveBeenCalledWith({ where: { code: CODE }, data: { deviceId: response.device_id } });
  });
});
