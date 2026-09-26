import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { LestaClients, PrismaService } from '../../../../../core';

import { EquipmentSyncService } from '../equipment-sync.service';

const createSync = () => {
  const prisma = mockDeep<PrismaService>();
  const clients = mockDeep<LestaClients>();

  clients.bulk.encyclopedia.crewskills.mockResolvedValue({});
  clients.bulk.encyclopedia.crewroles.mockResolvedValue({});

  return { prisma, clients, service: new EquipmentSyncService(prisma, clients) };
};

const gun = { module_id: 10, name: 'ZiS-3', type: 'vehicleGun', nation: 'ussr', tier: 5 };

describe('EquipmentSyncService.modules', () => {
  it('writes nothing for an empty response', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.modules.mockResolvedValue({});

    expect(await service.modules()).toBe(0);
    expect(prisma.module.upsert).not.toHaveBeenCalled();
    expect(prisma.module.deleteMany).not.toHaveBeenCalled();
  });

  it('skips modules of an unknown type', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.modules.mockResolvedValue({ 10: gun, 11: { ...gun, module_id: 11, type: 'vehicleWings' } });

    expect(await service.modules()).toBe(1);
    expect(prisma.module.upsert.mock.calls[0]?.[0].where).toEqual({ moduleId: 10 });
  });

  it('stores missing optional fields as null and a missing tank list as empty', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.modules.mockResolvedValue({ 10: gun });

    await service.modules();

    expect(prisma.module.upsert.mock.calls[0]?.[0].update).toMatchObject({ priceCredit: null, weight: null, image: null, tankIds: [] });
  });
});

describe('EquipmentSyncService.provisions', () => {
  it('skips provisions of an unknown type and keeps a zero price', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.provisions.mockResolvedValue({
      1: { provision_id: 1, name: 'Rammer', type: 'optionalDevice', price_credit: 0 },
      2: { provision_id: 2, name: 'Mystery', type: 'boosterOfDoom' }
    });

    expect(await service.provisions()).toBe(1);
    expect(prisma.provision.upsert.mock.calls[0]?.[0].update).toMatchObject({ type: 'optionalDevice', priceCredit: 0, priceGold: null });
  });
});

describe('EquipmentSyncService.crew', () => {
  it('counts skills and roles together', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.crewskills.mockResolvedValue({ repair: { name: 'Repair', image_url: { small: null, big: 'repair.png' } } });
    clients.bulk.encyclopedia.crewroles.mockResolvedValue({ commander: { name: 'Commander' } });

    expect(await service.crew()).toBe(2);
    expect(prisma.crewSkill.upsert.mock.calls[0]?.[0].create).toMatchObject({ skill: 'repair', image: 'repair.png', isCommon: false, roles: [] });
    expect(prisma.crewRole.upsert.mock.calls[0]?.[0].create).toMatchObject({ role: 'commander', skills: [] });
  });

  it('stores no image when every skill image is missing', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.crewskills.mockResolvedValue({ repair: { name: 'Repair', image_url: { small: null } } });

    await service.crew();

    expect(prisma.crewSkill.upsert.mock.calls[0]?.[0].update).toMatchObject({ image: null });
  });

  it('skips a malformed skill entry', async () => {
    const { prisma, clients, service } = createSync();

    clients.bulk.encyclopedia.crewskills.mockResolvedValue({ broken: 'text' });

    expect(await service.crew()).toBe(0);
    expect(prisma.crewSkill.upsert).not.toHaveBeenCalled();
  });
});
