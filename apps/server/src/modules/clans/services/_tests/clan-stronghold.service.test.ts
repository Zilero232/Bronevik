import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { ClanStronghold } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { LestaClient } from '../../../../lib/lesta';

import { STRONGHOLD_FETCH } from '../../config';
import { ClanStrongholdService } from '../clan-stronghold.service';

const clanId = 42n;
const [levelKey = ''] = STRONGHOLD_FETCH.levelKeys;

const stored: ClanStronghold = {
  clanId,
  level: 7,
  buildings: null,
  reserves: null,
  stats: { building_slots: 3 },
  updatedAt: new Date('2026-09-01T00:00:00Z')
};

const createService = (row: ClanStronghold | null) => {
  const prisma = mockDeep<PrismaService>();
  const lesta = mockDeep<LestaClient>();

  prisma.clanStronghold.findUnique.mockResolvedValue(row);
  prisma.clanSnapshot.findFirst.mockResolvedValue(null);
  prisma.globalMapProvince.findMany.mockResolvedValue([]);

  return { service: new ClanStrongholdService(prisma, lesta), prisma, lesta };
};

describe('ClanStrongholdService', () => {
  it('uses the stored row without calling Lesta', async () => {
    const { service, lesta } = createService(stored);

    const stronghold = await service.stronghold(clanId);

    expect(stronghold.level).toBe(stored.level);
    expect(stronghold.buildingSlots).toBe(3);
    expect(lesta.stronghold.claninfo).not.toHaveBeenCalled();
  });

  it('fetches from Lesta and stores the result when nothing is stored', async () => {
    const { service, prisma, lesta } = createService(null);
    const info = { [levelKey]: 5, building_slots: 2 };

    lesta.stronghold.claninfo.mockResolvedValue({ [String(clanId)]: info });
    prisma.clanStronghold.upsert.mockResolvedValue({ ...stored, level: 5, stats: info });

    const stronghold = await service.stronghold(clanId);

    expect(prisma.clanStronghold.upsert).toHaveBeenCalledWith(expect.objectContaining({ create: expect.objectContaining({ clanId, level: 5 }) }));
    expect(stronghold.level).toBe(5);
  });

  it('returns an empty stronghold when Lesta knows no such clan', async () => {
    const { service, prisma, lesta } = createService(null);

    lesta.stronghold.claninfo.mockResolvedValue({});

    const stronghold = await service.stronghold(clanId);

    expect(stronghold).toMatchObject({ clanId: Number(clanId), level: null, buildings: [], battles: 0, updatedAt: null });
    expect(prisma.clanStronghold.upsert).not.toHaveBeenCalled();
  });

  it('returns an empty stronghold instead of throwing when Lesta fails', async () => {
    const { service, prisma, lesta } = createService(null);

    lesta.stronghold.claninfo.mockRejectedValue(new Error('lesta down'));

    await expect(service.stronghold(clanId)).resolves.toMatchObject({ level: null, buildings: [] });
    expect(prisma.clanStronghold.upsert).not.toHaveBeenCalled();
  });
});
