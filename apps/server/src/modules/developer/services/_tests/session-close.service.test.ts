import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PlaySession } from '../../../../../generated';
import type { PrismaService, WebhookEmitter } from '../../../../core';

import { SessionCloseService } from '../session-close.service';

const session = (overrides: Partial<PlaySession> = {}) => ({
  ...mock<PlaySession>(),
  id: 'session',
  accountId: 1n,
  source: 'mod' as const,
  battles: 4,
  wins: 3,
  damageDealt: 8_000,
  wn8: 2_000,
  startedAt: new Date('2026-09-25T10:00:00Z'),
  lastActivityAt: new Date('2026-09-25T11:00:00Z'),
  player: { clanId: 10n, nickname: 'Tanker' },
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const webhooks = mock<WebhookEmitter>();

  prisma.playSession.updateMany.mockResolvedValue({ count: 1 });

  return { service: new SessionCloseService(prisma, webhooks), prisma, webhooks };
};

describe('SessionCloseService.closeIdle', () => {
  it('closes an idle session and announces it to the player and the clan', async () => {
    const { service, prisma, webhooks } = createService();

    prisma.playSession.findMany.mockResolvedValue([session()]);

    await expect(service.closeIdle()).resolves.toBe(1);
    expect(webhooks.emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'session.ended', subject: { accountIds: [1], clanIds: [10] } }));
  });

  it('closes an empty session without announcing it', async () => {
    const { service, prisma, webhooks } = createService();

    prisma.playSession.findMany.mockResolvedValue([session({ battles: 0, wins: 0 })]);

    await expect(service.closeIdle()).resolves.toBe(0);
    expect(prisma.playSession.updateMany).toHaveBeenCalled();
    expect(webhooks.emit).not.toHaveBeenCalled();
  });

  it('does not announce a session another worker closed first', async () => {
    const { service, prisma, webhooks } = createService();

    prisma.playSession.findMany.mockResolvedValue([session()]);
    prisma.playSession.updateMany.mockResolvedValue({ count: 0 });

    await service.closeIdle();

    expect(webhooks.emit).not.toHaveBeenCalled();
  });
});
