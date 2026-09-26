import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { GameVersion } from '../../../../../../generated';
import type { LestaClients, PrismaService } from '../../../../../core';

import { JOB } from '../../../contracts';
import { CatalogSyncService } from '../catalog-sync.service';
import { EncyclopediaSyncService } from '../encyclopedia-sync.service';
import { EquipmentSyncService } from '../equipment-sync.service';
import { VehicleSyncService } from '../vehicle-sync.service';

const INFO = { game_version: '2.1.0', tanks_updated_at: 1_790_000_000 };

const createSync = (stored: string | null) => {
  const prisma = mockDeep<PrismaService>();
  const clients = mockDeep<LestaClients>();
  const queue = mock<Queue>();
  const vehicles = mock<VehicleSyncService>();
  const equipment = mock<EquipmentSyncService>();
  const catalog = mock<CatalogSyncService>();
  const current = stored === null ? null : mock<GameVersion>({ id: 1, version: stored });

  clients.priority.encyclopedia.info.mockResolvedValue(INFO);
  prisma.gameVersion.findFirst.mockResolvedValue(current);
  prisma.$transaction.mockResolvedValue(mock<GameVersion>({ id: 7, version: INFO.game_version }));
  vehicles.sync.mockResolvedValue(10);
  equipment.modules.mockResolvedValue(20);
  equipment.provisions.mockResolvedValue(30);
  equipment.crew.mockResolvedValue(40);
  catalog.arenas.mockResolvedValue(50);
  catalog.achievements.mockResolvedValue(60);

  return { prisma, queue, vehicles, equipment, service: new EncyclopediaSyncService(prisma, clients, queue, vehicles, equipment, catalog) };
};

describe('EncyclopediaSyncService.checkVersion', () => {
  it('queues nothing while the game version is unchanged', async () => {
    const { queue, service } = createSync(INFO.game_version);

    expect(await service.checkVersion()).toEqual({ version: INFO.game_version, changed: false });
    expect(queue.add).not.toHaveBeenCalled();
  });

  it('queues one forced sync per new game version', async () => {
    const { queue, service } = createSync('2.0.0');

    expect(await service.checkVersion()).toEqual({ version: INFO.game_version, changed: true });

    expect(queue.add).toHaveBeenCalledWith(
      JOB.reference.encyclopedia,
      { force: true },
      { deduplication: { id: expect.stringContaining(INFO.game_version) } }
    );
  });

  it('treats a first run without a stored version as a change', async () => {
    const { queue, service } = createSync(null);

    expect((await service.checkVersion()).changed).toBe(true);
    expect(queue.add).toHaveBeenCalledOnce();
  });
});

describe('EncyclopediaSyncService.sync', () => {
  it('skips an unforced sync of the version already stored', async () => {
    const { prisma, vehicles, service } = createSync(INFO.game_version);

    expect(await service.sync({ force: false })).toEqual({ version: INFO.game_version, skipped: true });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(vehicles.sync).not.toHaveBeenCalled();
  });

  it('syncs every section against the new version row', async () => {
    const { vehicles, service } = createSync(INFO.game_version);

    const result = await service.sync({ force: true });

    expect(vehicles.sync).toHaveBeenCalledWith(7);

    expect(result).toEqual({
      version: INFO.game_version,
      counts: { vehicles: 10, modules: 20, provisions: 30, crew: 40, arenas: 50, achievements: 60 }
    });
  });

  it('marks a failed section and still runs the others', async () => {
    const { equipment, service } = createSync('2.0.0');

    equipment.modules.mockRejectedValue(new Error('SOURCE_NOT_AVAILABLE'));

    const result = await service.sync({ force: false });

    expect(result).toMatchObject({ counts: { modules: -1, provisions: 30, achievements: 60 } });
  });

  it('records the synced version in the collector state', async () => {
    const { prisma, service } = createSync(null);

    await service.sync({ force: false });

    expect(prisma.collectorState.upsert.mock.calls[0]?.[0].update.value).toMatchObject({
      version: INFO.game_version,
      tanksUpdatedAt: INFO.tanks_updated_at
    });
  });
});
