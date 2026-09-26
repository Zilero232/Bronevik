import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { GameVersion, Vehicle } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { BuildRow } from '../../community-builds.types';

import { AppNotFoundException } from '../../../../common/exceptions';
import { BuildShareService } from '../build-share.service';

const loadout = { equipment: [], consumables: [], directives: [], ammo: [], crewSkills: {}, fieldModifications: [] };

const build: BuildRow = {
  id: '11111111-1111-4111-8111-111111111111',
  authorUserId: 'author',
  tankId: 1,
  gameVersionId: null,
  title: 'Heavy brawler',
  description: null,
  loadout,
  stats: null,
  visibility: 'public',
  status: 'published',
  likesCount: 3,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  author: { id: 'author', name: 'Author', image: null },
  gameVersion: null
};

const createService = (row: BuildRow | null = build) => {
  const prisma = mockDeep<PrismaService>();

  prisma.build.findUnique.mockResolvedValue(row);
  prisma.buildLike.findMany.mockResolvedValue([]);
  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new BuildShareService(prisma), prisma };
};

describe('BuildShareService.get', () => {
  it('hides a private build from other users', async () => {
    const { service } = createService({ ...build, visibility: 'private' });

    await expect(service.get({ id: build.id, viewerUserId: 'other' })).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('hides an unpublished build from other users', async () => {
    const { service } = createService({ ...build, status: 'pending' });

    await expect(service.get({ id: build.id, viewerUserId: null })).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('shows a private unpublished build to its author', async () => {
    const { service } = createService({ ...build, visibility: 'private', status: 'hidden' });

    expect((await service.get({ id: build.id, viewerUserId: 'author' })).id).toBe(build.id);
  });

  it('marks a build the viewer liked', async () => {
    const { service, prisma } = createService();

    prisma.buildLike.findMany.mockResolvedValue([{ buildId: build.id, userId: 'viewer', createdAt: new Date() }]);

    expect((await service.get({ id: build.id, viewerUserId: 'viewer' })).likedByMe).toBe(true);
  });
});

describe('BuildShareService.like', () => {
  it('increments the counter only the first time a user likes', async () => {
    const { service, prisma } = createService();

    prisma.buildLike.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ buildId: build.id, userId: 'viewer', createdAt: new Date() });
    prisma.build.findUniqueOrThrow.mockResolvedValue({ ...build, likesCount: 4 });

    await service.like({ id: build.id, userId: 'viewer', liked: true });
    await service.like({ id: build.id, userId: 'viewer', liked: true });

    expect(prisma.buildLike.create).toHaveBeenCalledTimes(1);
    expect(prisma.build.update).toHaveBeenCalledTimes(1);
    expect(prisma.build.update).toHaveBeenCalledWith({ where: { id: build.id }, data: { likesCount: { increment: 1 } } });
  });

  it('decrements only when the like existed', async () => {
    const { service, prisma } = createService();

    prisma.buildLike.findUnique.mockResolvedValue(null);
    prisma.build.findUniqueOrThrow.mockResolvedValue(build);

    await service.like({ id: build.id, userId: 'viewer', liked: false });

    expect(prisma.buildLike.delete).not.toHaveBeenCalled();
    expect(prisma.build.update).not.toHaveBeenCalled();
  });

  it('never reports a negative counter', async () => {
    const { service, prisma } = createService();

    prisma.buildLike.findUnique.mockResolvedValue(null);
    prisma.build.findUniqueOrThrow.mockResolvedValue({ ...build, likesCount: -1 });

    expect(await service.like({ id: build.id, userId: 'viewer', liked: false })).toEqual({ liked: false, likesCount: 0 });
  });

  it('refuses to like a build the user cannot see', async () => {
    const { service, prisma } = createService({ ...build, visibility: 'private' });

    await expect(service.like({ id: build.id, userId: 'viewer', liked: true })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

describe('BuildShareService.create', () => {
  it('refuses an unknown tank', async () => {
    const { service, prisma } = createService();

    prisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(service.create({ userId: 'author', tankId: 999, title: 'Heavy brawler', loadout, visibility: 'public' })).rejects.toBeInstanceOf(
      AppNotFoundException
    );

    expect(prisma.build.create).not.toHaveBeenCalled();
  });

  it('pins the build to the current game version', async () => {
    const { service, prisma } = createService();

    prisma.vehicle.findUnique.mockResolvedValue(mock<Vehicle>({ tankId: 1 }));
    prisma.gameVersion.findFirst.mockResolvedValue(mock<GameVersion>({ id: 5 }));
    prisma.build.create.mockResolvedValue(build);

    await service.create({ userId: 'author', tankId: 1, title: 'Heavy brawler', loadout, visibility: 'public' });

    expect(prisma.build.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ gameVersionId: 5, authorUserId: 'author' }) })
    );
  });
});

describe('BuildShareService.update', () => {
  it('refuses a build the user does not own', async () => {
    const { service, prisma } = createService();

    prisma.build.findFirst.mockResolvedValue(null);

    await expect(service.update({ id: build.id, userId: 'other', title: 'New title' })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.build.update).not.toHaveBeenCalled();
  });

  it('writes only the fields that were sent', async () => {
    const { service, prisma } = createService();

    prisma.build.findFirst.mockResolvedValue(build);

    await service.update({ id: build.id, userId: 'author', title: 'New title' });

    expect(prisma.build.update).toHaveBeenCalledWith({ where: { id: build.id }, data: { title: 'New title' } });
  });
});
