import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { MissionCatalogService } from '../mission-catalog.service';
import { MissionProgressService } from '../mission-progress.service';

const updatedAt = new Date('2026-09-26T10:00:00Z');

const setup = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mockDeep<MissionCatalogService>();

  return { prisma, catalog, service: new MissionProgressService(prisma, catalog) };
};

describe('MissionProgressService.update', () => {
  it('marks a mission done when it is completed with honors', async () => {
    const { prisma, service } = setup();

    prisma.mission.findFirst.mockResolvedValue({ questId: 5 } as never);
    prisma.userMissionProgress.upsert.mockResolvedValue({ userId: 'u', questId: 5, done: true, honors: true, source: 'manual', updatedAt });

    const item = await service.update({ userId: 'u', questId: 5, done: false, honors: true });

    expect(prisma.userMissionProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: { userId: 'u', questId: 5, done: true, honors: true, source: 'manual' } })
    );

    expect(item).toEqual({ questId: 5, done: true, honors: true, source: 'manual', updatedAt: updatedAt.toISOString() });
  });

  it('refuses a mission the game data does not know', async () => {
    const { prisma, service } = setup();

    prisma.mission.findFirst.mockResolvedValue(null);

    await expect(service.update({ userId: 'u', questId: 999, done: true, honors: false })).rejects.toMatchObject({ status: 404 });
    expect(prisma.userMissionProgress.upsert).not.toHaveBeenCalled();
  });
});

describe('MissionProgressService.next', () => {
  it('returns nothing before personal missions are imported', async () => {
    const { catalog, service } = setup();

    catalog.currentVersion.mockResolvedValue(null);

    expect(await service.next('u')).toBeNull();
  });

  it('lists the next open mission of each branch in the operation last touched', async () => {
    const { prisma, catalog, service } = setup();
    const mission = (questId: number, chainId: number, position: number) => ({
      gameVersionId: 1,
      questId,
      name: `m${questId}`,
      campaignId: 1,
      operationId: 1,
      chainId,
      position,
      title: `M${questId}`,
      shortTitle: null,
      description: null,
      advice: null,
      minTier: 4,
      maxTier: 10,
      vehicleClasses: [],
      alliances: [],
      isInitial: position === 1,
      isFinal: false,
      hasHonors: true,
      requiredUnlocks: [],
      conditions: [
        { progressId: 'damage', isMain: true, isAward: true, display: 'regular', icon: null, goal: 1, title: null, description: 'Deal damage' }
      ]
    });

    const missions = [mission(1, 1, 1), mission(2, 1, 2), mission(16, 2, 1)];

    catalog.currentVersion.mockResolvedValue({ id: 1, version: '1.45' });
    prisma.userMissionProgress.findFirst.mockResolvedValue({ questId: 1 } as never);
    prisma.userMissionProgress.findMany.mockResolvedValue([{ questId: 1, done: true, honors: true }] as never);
    prisma.mission.findUnique.mockResolvedValue(missions[0]);

    catalog.operationById.mockResolvedValue({
      operation: {
        gameVersionId: 1,
        operationId: 1,
        campaignId: 1,
        name: 'StuG IV',
        description: null,
        iconId: null,
        nextOperationIds: [],
        chainsCount: 2,
        missionsPerChain: 15,
        chainsToUnlockNext: 2,
        rewardTankId: null,
        rewardTankTag: null
      },
      branches: [
        { gameVersionId: 1, operationId: 1, chainId: 1, kind: 'vehicleClass', key: 'lightTank', nations: [], minTier: 4, maxTier: 10 },
        { gameVersionId: 1, operationId: 1, chainId: 2, kind: 'vehicleClass', key: 'heavyTank', nations: [], minTier: 4, maxTier: 10 }
      ],
      missions
    });

    expect(await service.next('u')).toEqual({
      operationName: 'StuG IV',
      campaignId: 1,
      operationId: 1,
      missions: [
        { branchKey: 'lightTank', title: 'M2', condition: 'Deal damage' },
        { branchKey: 'heavyTank', title: 'M16', condition: 'Deal damage' }
      ]
    });
  });
});
