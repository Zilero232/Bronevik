import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { ClanListService } from '../clan-list.service';

const row = {
  clanId: 10n,
  tag: 'BRNVK',
  name: 'Три отметки',
  color: '#ff0000',
  motto: null,
  emblems: null,
  membersCount: 80,
  createdAt: null,
  isDisbanded: false,
  avgWn8: 1_800,
  avgWinRate: 55.5,
  activeMembers7d: 40,
  eloRating10: 1_200,
  strongholdLevel: 10,
  total: 3n
};

describe('ClanListService.list', () => {
  it('maps the rows and reports the total of the whole result', async () => {
    const prisma = mockDeep<PrismaService>();

    prisma.$queryRaw.mockResolvedValue([row]);

    const page = await new ClanListService(prisma).list({ limit: 1, offset: 0, order: 'desc', search: 'брон' });

    expect(page.total).toBe(3);
    expect(page.items[0]?.clan).toMatchObject({ clanId: 10, tag: 'BRNVK', color: '#ff0000' });
    expect(page.items[0]?.avgWinRate).toBe(row.avgWinRate);
    expect(page.items[0]?.avgWn8.tier).not.toBeNull();
  });

  it('answers an empty page with a zero total', async () => {
    const prisma = mockDeep<PrismaService>();

    prisma.$queryRaw.mockResolvedValue([]);

    expect(await new ClanListService(prisma).list({ limit: 25, offset: 0, order: 'desc' })).toEqual({ items: [], total: 0, limit: 25, offset: 0 });
  });
});
