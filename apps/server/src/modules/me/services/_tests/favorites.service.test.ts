import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Clan, Favorite, Player } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { CollectorProducerService } from '../../../collector';
import type { VehicleCatalogService } from '../../../reference';

import { AppConflictException, AppNotFoundException } from '../../../../common/exceptions';
import { unknownVehicle } from '../../../reference/mappers';
import { FAVORITES } from '../../config';
import { FavoritesService } from '../favorites.service';

const CREATED_AT = new Date('2026-09-01T00:00:00.000Z');

const favorite = (kind: Favorite['kind'], targetId: bigint): Favorite =>
  mock<Favorite>({ id: `${kind}-${targetId}`, kind, targetId, label: null, isOwn: false, createdAt: CREATED_AT });

const createService = (rows: Favorite[] = []) => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const collector = mock<CollectorProducerService>();

  prisma.favorite.findMany.mockResolvedValue(rows);
  prisma.favorite.count.mockResolvedValue(rows.length);
  prisma.player.findMany.mockResolvedValue([]);
  prisma.clan.findMany.mockResolvedValue([]);

  catalog.all.mockResolvedValue(
    new Map([[1, { summary: { ...unknownVehicle(1), name: 'IS-7' }, dbType: 'heavyTank', specs: null, description: null }]])
  );

  return { service: new FavoritesService(prisma, catalog, collector), prisma, collector };
};

describe('FavoritesService.list', () => {
  it('titles players by nickname, clans by tag and tanks by name', async () => {
    const { service, prisma } = createService([favorite('player', 7n), favorite('clan', 8n), favorite('tank', 1n)]);

    prisma.player.findMany.mockResolvedValue([mock<Player>({ accountId: 7n, nickname: 'Tanker' })]);
    prisma.clan.findMany.mockResolvedValue([mock<Clan>({ clanId: 8n, tag: 'TAG' })]);

    const titles = (await service.list('user')).map((entry) => entry.title);

    expect(titles).toEqual(['Tanker', 'TAG', 'IS-7']);
  });

  it('leaves the title empty for targets that no longer exist', async () => {
    const { service } = createService([favorite('player', 7n), favorite('clan', 8n), favorite('tank', 99n)]);

    expect((await service.list('user')).map((entry) => entry.title)).toEqual([null, null, null]);
  });
});

describe('FavoritesService.create', () => {
  it('refuses a new favourite at the limit', async () => {
    const { service, prisma } = createService();

    prisma.favorite.count.mockResolvedValue(FAVORITES.maxCount);

    await expect(service.create({ userId: 'user', kind: 'tank', targetId: 1 })).rejects.toBeInstanceOf(AppConflictException);
    expect(prisma.favorite.upsert).not.toHaveBeenCalled();
  });

  it('still updates the label of an existing favourite at the limit', async () => {
    const { service, prisma } = createService([favorite('tank', 1n)]);

    prisma.favorite.count.mockResolvedValue(FAVORITES.maxCount);
    prisma.favorite.findUnique.mockResolvedValue(favorite('tank', 1n));

    await expect(service.create({ userId: 'user', kind: 'tank', targetId: 1, label: 'main' })).resolves.toMatchObject({ kind: 'tank', targetId: 1 });
    expect(prisma.favorite.upsert).toHaveBeenCalled();
  });

  it('enrols a favourite player for tracking with high priority', async () => {
    const { service, collector } = createService([favorite('player', 7n)]);

    await service.create({ userId: 'user', kind: 'player', targetId: 7 });

    expect(collector.enrol).toHaveBeenCalledWith(expect.objectContaining({ accountId: 7, priority: 'high' }));
  });

  it('does not enrol clans or tanks', async () => {
    const { service, collector } = createService([favorite('tank', 1n)]);

    await service.create({ userId: 'user', kind: 'tank', targetId: 1 });

    expect(collector.enrol).not.toHaveBeenCalled();
  });
});

describe('FavoritesService.remove', () => {
  it('answers 404 when the favourite is not the user’s', async () => {
    const { service, prisma } = createService();

    prisma.favorite.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove({ userId: 'user', id: 'other' })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({ where: { id: 'other', userId: 'user' } });
  });
});
