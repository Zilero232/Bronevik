import { Injectable } from '@nestjs/common';

import type { CloseOwnInput, CommentView, CreateCommentRequest, ListCommentsInput } from '../community.types';

import { AppBadRequestException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { AUTHOR_SELECT, COMMENTS } from '../config';
import { toCommentView } from '../lib/community-views';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ target, targetId }: ListCommentsInput): Promise<CommentView[]> {
    const rows = await this.prisma.comment.findMany({
      where: { target, targetId, status: { in: ['published', 'hidden'] } },
      orderBy: { createdAt: 'asc' },
      take: COMMENTS.pageLimit,
      include: { author: { select: AUTHOR_SELECT } }
    });

    return rows.map(toCommentView);
  }

  async create({ userId, target, targetId, parentId, body }: CreateCommentRequest): Promise<CommentView> {
    if (!(await this.targetExists({ target, targetId }))) {
      throw new AppNotFoundException('NOT_FOUND', `Nothing to comment at ${target} ${targetId}`);
    }

    if (parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: parentId }, select: { target: true, targetId: true } });

      if (!parent || parent.target !== target || parent.targetId !== targetId) {
        throw new AppBadRequestException('VALIDATION_FAILED', 'The parent comment belongs to another thread');
      }
    }

    const comment = await this.prisma.comment.create({
      data: { authorUserId: userId, target, targetId, parentId: parentId ?? null, body },
      include: { author: { select: AUTHOR_SELECT } }
    });

    return toCommentView(comment);
  }

  async remove({ id, userId }: CloseOwnInput): Promise<void> {
    const { count } = await this.prisma.comment.updateMany({ where: { id, authorUserId: userId }, data: { status: 'hidden' } });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No comment ${id} of yours`);
    }
  }

  private async targetExists({ target, targetId }: ListCommentsInput): Promise<boolean> {
    const isUuid = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(targetId);

    if (!isUuid) {
      return false;
    }

    const where = { where: { id: targetId }, select: { id: true } };
    const found =
      target === 'build'
        ? await this.prisma.build.findUnique(where)
        : target === 'guide'
          ? await this.prisma.guide.findUnique(where)
          : target === 'replay'
            ? await this.prisma.replay.findUnique(where)
            : await this.prisma.tacticBoard.findUnique(where);

    return found !== null;
  }
}
