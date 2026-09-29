import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Arena } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { AppNotFoundException } from '../../../../common/exceptions';
import { MAP_TEAMS } from '../../config';
import { MapsService } from '../maps.service';

const [team = 0] = MAP_TEAMS.teams;

const arena = mock<Arena>({
  arenaId: '01_karelia',
  slug: 'karelia',
  name: 'Karelia',
  camouflageType: null,
  description: null,
  image: null,
  sizeMeters: null,
  modes: [],
  data: null
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.arena.findFirst.mockResolvedValue(arena);

  return { service: new MapsService(prisma), prisma };
};

describe('MapsService', () => {
  it('answers 404 for an unknown map', async () => {
    const { service, prisma } = createService();

    prisma.arena.findFirst.mockResolvedValue(null);

    await expect(service.detail('nowhere')).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('prefers stats from battles and never reads replays then', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValueOnce([{ team, result: 'win', battles: 1 }]);

    const detail = await service.detail(arena.slug);

    expect(detail.stats?.source).toBe('battles');
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('falls back to replays when no battles were recorded', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([{ winner: team, battles: 2 }]);

    const detail = await service.detail(arena.slug);

    expect(detail.stats?.source).toBe('replays');
    expect(detail.stats?.battles).toBe(2);
  });

  it('reports no stats when neither source has data', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([]);

    expect((await service.detail(arena.slug)).stats).toBeNull();
  });
});
