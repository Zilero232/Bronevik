import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { LocalSearchService } from '../local-search.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.mockResolvedValue([]);

  return { service: new LocalSearchService(prisma), prisma };
};

const patternsOf = (prisma: ReturnType<typeof createService>['prisma']) => prisma.$queryRaw.mock.calls[0]?.slice(1)[1];

describe('LocalSearchService', () => {
  it.each(['players', 'clans', 'tanks', 'maps'] as const)('skips the database for %s without terms', async (kind) => {
    const { service, prisma } = createService();

    await expect(service[kind]({ terms: [], limit: 5 })).resolves.toEqual([]);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('matches players and clans by prefix with LIKE wildcards escaped', async () => {
    const { service, prisma } = createService();

    await service.players({ terms: ['a_b%'], limit: 5 });

    expect(patternsOf(prisma)).toEqual(['a\\_b\\%%']);
  });

  it('matches tanks and maps anywhere in the name', async () => {
    const { service, prisma } = createService();

    await service.tanks({ terms: ['IS'], limit: 5 });

    expect(patternsOf(prisma)).toEqual(['%IS%']);
  });
});
