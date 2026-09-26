import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Guide, User } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { GuideRow } from '../../guides.types';

import { AppNotFoundException } from '../../../../common/exceptions';
import { GUIDES } from '../../config';
import { GuideService } from '../guide.service';

const author = { id: 'author', name: 'Author', image: 'https://cdn.example/a.png' };

const guide: GuideRow = {
  id: '22222222-2222-4222-8222-222222222222',
  authorUserId: 'author',
  slug: 'heavy-brawling-abc123',
  kind: 'general',
  tankId: null,
  arenaId: null,
  locale: 'ru',
  title: 'Heavy brawling',
  body: 'A long enough body',
  status: 'published',
  likesCount: 0,
  publishedAt: new Date('2026-01-02T00:00:00Z'),
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  author
};

type AuthorGroup = Awaited<ReturnType<PrismaService['guide']['groupBy']>>[number];

const authorGroup = ({ authorUserId, guides, likes }: { authorUserId: string; guides: number; likes: number | null }) =>
  mock<AuthorGroup>({ authorUserId, _count: { _all: guides }, _sum: { likesCount: likes } });

const createService = (row: GuideRow | null = guide) => {
  const prisma = mockDeep<PrismaService>();

  prisma.guide.findUnique.mockResolvedValue(row);
  prisma.guideLike.findMany.mockResolvedValue([]);
  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new GuideService(prisma), prisma };
};

describe('GuideService.create', () => {
  it('puts a new guide into moderation', async () => {
    const { service, prisma } = createService({ ...guide, status: 'pending', publishedAt: null });

    prisma.guide.create.mockResolvedValue({ ...guide, status: 'pending', publishedAt: null });

    const view = await service.create({ userId: 'author', kind: 'general', locale: 'ru', title: 'Heavy brawling', body: guide.body });

    expect(prisma.guide.create).toHaveBeenCalledWith({ data: expect.objectContaining({ status: 'pending', authorUserId: 'author' }) });
    expect(view.status).toBe('pending');
  });

  it('derives a slug from the title', async () => {
    const { service, prisma } = createService();

    prisma.guide.create.mockResolvedValue(guide);

    await service.create({ userId: 'author', kind: 'general', locale: 'ru', title: 'Heavy brawling', body: guide.body });

    expect(prisma.guide.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ slug: expect.stringMatching(/^heavy-brawling-[\da-f]{6}$/) })
    });
  });
});

describe('GuideService.update', () => {
  it('sends an edited guide back to moderation', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(mock<Guide>({ slug: guide.slug }));

    await service.update({ id: guide.id, userId: 'author', title: 'Heavy brawling 2' });

    expect(prisma.guide.update).toHaveBeenCalledWith({ where: { id: guide.id }, data: { title: 'Heavy brawling 2', status: 'pending' } });
  });

  it('drops the old tank and map when the guide changes its kind', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(mock<Guide>({ slug: guide.slug, kind: 'tank' }));

    await service.update({ id: guide.id, userId: 'author', kind: 'map', arenaId: '14_siegfried_line' });

    expect(prisma.guide.update).toHaveBeenCalledWith({
      where: { id: guide.id },
      data: { kind: 'map', tankId: null, arenaId: '14_siegfried_line', status: 'pending' }
    });
  });

  it('refuses a guide of another user', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(null);

    await expect(service.update({ id: guide.id, userId: 'other', title: 'Heavy brawling 2' })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.guide.update).not.toHaveBeenCalled();
  });
});

describe('GuideService.bySlug', () => {
  it('hides an unpublished guide from other users', async () => {
    const { service } = createService({ ...guide, status: 'pending' });

    await expect(service.bySlug({ slug: guide.slug, viewerUserId: 'other' })).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('hides an unpublished guide from anonymous visitors', async () => {
    const { service } = createService({ ...guide, status: 'hidden' });

    await expect(service.bySlug({ slug: guide.slug, viewerUserId: null })).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('shows an unpublished guide to its author', async () => {
    const { service } = createService({ ...guide, status: 'pending' });

    expect((await service.bySlug({ slug: guide.slug, viewerUserId: 'author' })).status).toBe('pending');
  });

  it('does not look up likes for an anonymous visitor', async () => {
    const { service, prisma } = createService();

    expect((await service.bySlug({ slug: guide.slug, viewerUserId: null })).likedByMe).toBe(false);
    expect(prisma.guideLike.findMany).not.toHaveBeenCalled();
  });
});

describe('GuideService.like', () => {
  it('refuses to like an unpublished guide', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(null);

    await expect(service.like({ id: guide.id, userId: 'viewer', liked: true })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('increments the counter only the first time a user likes', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(guide);
    prisma.guideLike.createMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
    prisma.guide.findUniqueOrThrow.mockResolvedValue({ ...guide, likesCount: 1 });

    await service.like({ id: guide.id, userId: 'viewer', liked: true });
    await service.like({ id: guide.id, userId: 'viewer', liked: true });

    expect(prisma.guideLike.createMany).toHaveBeenCalledWith({ data: [{ guideId: guide.id, userId: 'viewer' }], skipDuplicates: true });
    expect(prisma.guide.update).toHaveBeenCalledTimes(1);
  });

  it('decrements the counter only when a like was actually removed', async () => {
    const { service, prisma } = createService();

    prisma.guide.findFirst.mockResolvedValue(guide);
    prisma.guideLike.deleteMany.mockResolvedValue({ count: 0 });
    prisma.guide.findUniqueOrThrow.mockResolvedValue({ ...guide, likesCount: 0 });

    await service.like({ id: guide.id, userId: 'viewer', liked: false });

    expect(prisma.guide.update).not.toHaveBeenCalled();
  });
});

describe('GuideService.topAuthors', () => {
  it('maps grouped rows to authors and drops authors that no longer exist', async () => {
    const { service, prisma } = createService();

    vi.mocked(prisma.guide.groupBy).mockResolvedValue([
      authorGroup({ authorUserId: 'author', guides: 2, likes: 7 }),
      authorGroup({ authorUserId: 'gone', guides: 1, likes: 1 })
    ]);

    prisma.user.findMany.mockResolvedValue([mock<User>({ ...author })]);

    expect(await service.topAuthors()).toEqual([{ author, guides: 2, likes: 7 }]);
    expect(prisma.guide.groupBy).toHaveBeenCalledWith(expect.objectContaining({ take: GUIDES.authorsLimit }));
  });

  it('counts an author with no likes as zero', async () => {
    const { service, prisma } = createService();

    vi.mocked(prisma.guide.groupBy).mockResolvedValue([authorGroup({ authorUserId: 'author', guides: 1, likes: null })]);
    prisma.user.findMany.mockResolvedValue([mock<User>({ ...author })]);

    expect((await service.topAuthors())[0]?.likes).toBe(0);
  });
});
