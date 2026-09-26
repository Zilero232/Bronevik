import { Injectable } from '@nestjs/common';

import type { Build, Prisma } from '../../../../generated';
import type { IdViewer, LikeInput, LikeResult, OwnedById } from '../../community-core';
import type {
  BuildPage,
  BuildsQuery,
  BuildView,
  BuildViewsInput,
  CreateBuildRequest,
  PopularBuildsInput,
  UpdateBuildRequest
} from '../community-builds.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { BUILD_SHARE } from '../config';
import { toBuildView } from '../mappers';
import { BUILD_INCLUDE } from '../selects';

@Injectable()
export class BuildShareService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ tankId, sort, limit, offset, viewerUserId }: BuildsQuery): Promise<BuildPage> {
    const where: Prisma.BuildWhereInput = { visibility: 'public', status: 'published', ...(tankId === undefined ? {} : { tankId }) };
    const orderBy: Prisma.BuildOrderByWithRelationInput[] =
      sort === 'popular' ? [{ likesCount: 'desc' }, { createdAt: 'desc' }] : [{ createdAt: 'desc' }];

    const [rows, total] = await Promise.all([
      this.prisma.build.findMany({ where, orderBy, take: limit, skip: offset, include: BUILD_INCLUDE }),
      this.prisma.build.count({ where })
    ]);

    return { items: await this.views({ rows, viewerUserId }), total, limit, offset };
  }

  async popular({ tankId, viewerUserId }: PopularBuildsInput): Promise<BuildView[]> {
    const rows = await this.prisma.build.findMany({
      where: { tankId, visibility: 'public', status: 'published' },
      orderBy: [{ likesCount: 'desc' }, { createdAt: 'desc' }],
      take: BUILD_SHARE.popularLimit,
      include: BUILD_INCLUDE
    });

    return this.views({ rows, viewerUserId });
  }

  async get({ id, viewerUserId }: IdViewer): Promise<BuildView> {
    const build = await this.prisma.build.findUnique({ where: { id }, include: BUILD_INCLUDE });

    if (!build || (build.authorUserId !== viewerUserId && (build.visibility === 'private' || build.status !== 'published'))) {
      throw new AppNotFoundException('NOT_FOUND', `No build ${id}`);
    }

    const [view] = await this.views({ rows: [build], viewerUserId });

    return view ?? this.notFound(id);
  }

  async create({ userId, tankId, title, description, loadout, visibility }: CreateBuildRequest): Promise<BuildView> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { tankId }, select: { tankId: true } });

    if (!vehicle) {
      throw new AppNotFoundException('TANK_NOT_FOUND', `No tank ${tankId}`);
    }

    const current = await this.prisma.gameVersion.findFirst({ where: { isCurrent: true }, select: { id: true } });
    const build = await this.prisma.build.create({
      data: {
        authorUserId: userId,
        tankId,
        title,
        description: description ?? null,
        loadout: toJsonValue(loadout),
        visibility,
        gameVersionId: current?.id ?? null
      },
      include: BUILD_INCLUDE
    });

    return this.get({ id: build.id, viewerUserId: userId });
  }

  async update({ id, userId, title, description, loadout, visibility }: UpdateBuildRequest): Promise<BuildView> {
    await this.owned({ id, userId });

    await this.prisma.build.update({
      where: { id },
      data: {
        ...(title === undefined ? {} : { title }),
        ...(description === undefined ? {} : { description }),
        ...(loadout === undefined ? {} : { loadout: toJsonValue(loadout) }),
        ...(visibility === undefined ? {} : { visibility })
      }
    });

    return this.get({ id, viewerUserId: userId });
  }

  async remove({ id, userId }: OwnedById): Promise<void> {
    await this.owned({ id, userId });
    await this.prisma.build.delete({ where: { id } });
  }

  async like({ id, userId, liked }: LikeInput): Promise<LikeResult> {
    await this.get({ id, viewerUserId: userId });

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.buildLike.findUnique({ where: { buildId_userId: { buildId: id, userId } } });

      if (liked && !existing) {
        await tx.buildLike.create({ data: { buildId: id, userId } });
        await tx.build.update({ where: { id }, data: { likesCount: { increment: 1 } } });
      }

      if (!liked && existing) {
        await tx.buildLike.delete({ where: { buildId_userId: { buildId: id, userId } } });
        await tx.build.update({ where: { id }, data: { likesCount: { decrement: 1 } } });
      }

      const build = await tx.build.findUniqueOrThrow({ where: { id }, select: { likesCount: true } });

      return { liked, likesCount: Math.max(0, build.likesCount) };
    });
  }

  private async owned({ id, userId }: OwnedById): Promise<Build> {
    const build = await this.prisma.build.findFirst({ where: { id, authorUserId: userId } });

    return build ?? this.notFound(id);
  }

  private async views({ rows, viewerUserId }: BuildViewsInput): Promise<BuildView[]> {
    const liked = viewerUserId
      ? await this.prisma.buildLike.findMany({
          where: { userId: viewerUserId, buildId: { in: rows.map((row) => row.id) } },
          select: { buildId: true }
        })
      : [];

    const likedIds = new Set(liked.map((like) => like.buildId));

    return rows.map((build) =>
      toBuildView({ build, author: build.author, likedByMe: likedIds.has(build.id), gameVersion: build.gameVersion?.version ?? null })
    );
  }

  private notFound(id: string): never {
    throw new AppNotFoundException('NOT_FOUND', `No build ${id}`);
  }
}
