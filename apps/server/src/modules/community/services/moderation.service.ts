import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { ReportStatus } from '../../../../generated';
import type { ContentReportView, CreateReportRequest, GuideView, ModerateInput, ReportTarget, ResolveReportRequest } from '../community.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { GUIDE_INCLUDE, MODERATION } from '../config';
import { toGuideView, toReportView } from '../lib';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async report({ userId, targetType, targetId, reason, details }: CreateReportRequest): Promise<ContentReportView> {
    const report = await this.prisma.contentReport.create({
      data: { reporterUserId: userId, targetType, targetId, reason, details: details ?? null }
    });

    return toReportView(report);
  }

  async reports(status: ReportStatus): Promise<ContentReportView[]> {
    const rows = await this.prisma.contentReport.findMany({ where: { status }, orderBy: { createdAt: 'asc' }, take: MODERATION.pageLimit });

    return rows.map(toReportView);
  }

  async resolve({ id, userId, status, hideTarget }: ResolveReportRequest): Promise<ContentReportView> {
    const report = await this.prisma.contentReport.findUnique({ where: { id } });

    if (!report) {
      throw new AppNotFoundException('NOT_FOUND', `No report ${id}`);
    }

    if (hideTarget) {
      await this.hide({ targetType: report.targetType, targetId: report.targetId });
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.contentReport.update({ where: { id }, data: { status, resolvedBy: userId, resolvedAt: new Date() } }),
      this.prisma.contentReport.updateMany({
        where: { targetType: report.targetType, targetId: report.targetId, status: 'open', id: { not: id } },
        data: { status, resolvedBy: userId, resolvedAt: new Date() }
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: `report.${status}`,
          entityType: report.targetType,
          entityId: report.targetId,
          metadata: toJsonValue({ reportId: id, hideTarget })
        }
      })
    ]);

    return toReportView(updated);
  }

  async moderate({ target, id, status }: ModerateInput): Promise<void> {
    const data = { status };
    const { count } = await match(target)
      .with('build', () => this.prisma.build.updateMany({ where: { id }, data }))
      .with('comment', () => this.prisma.comment.updateMany({ where: { id }, data }))
      .with('guide', () =>
        this.prisma.guide.updateMany({ where: { id }, data: { ...data, ...(status === 'published' ? { publishedAt: new Date() } : {}) } })
      )
      .exhaustive();

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No ${target} ${id}`);
    }
  }

  async pendingGuides(): Promise<GuideView[]> {
    const rows = await this.prisma.guide.findMany({ where: { status: 'pending' }, orderBy: { updatedAt: 'asc' }, include: GUIDE_INCLUDE });

    return rows.map((guide) => toGuideView({ guide, author: guide.author, likedByMe: false }));
  }

  private async hide({ targetType, targetId }: ReportTarget): Promise<void> {
    await match(targetType)
      .with('build', () => this.prisma.build.updateMany({ where: { id: targetId }, data: { status: 'hidden' } }))
      .with('guide', () => this.prisma.guide.updateMany({ where: { id: targetId }, data: { status: 'hidden' } }))
      .with('comment', () => this.prisma.comment.updateMany({ where: { id: targetId }, data: { status: 'hidden' } }))
      .with('replay', () => this.prisma.replay.updateMany({ where: { id: targetId }, data: { visibility: 'private' } }))
      .with('platoon_post', () => this.prisma.platoonPost.updateMany({ where: { id: targetId }, data: { status: 'hidden' } }))
      .with('recruiting_post', () => this.prisma.recruitingPost.updateMany({ where: { id: targetId }, data: { status: 'hidden' } }))
      .with('coach', () => this.prisma.coachProfile.updateMany({ where: { userId: targetId }, data: { isActive: false } }))
      .with('tournament', () => this.prisma.tournament.updateMany({ where: { id: targetId }, data: { status: 'cancelled' } }))
      .with('tactic_board', () => this.prisma.tacticBoard.updateMany({ where: { id: targetId }, data: { visibility: 'private' } }))
      .otherwise(() => ({ count: 0 }));
  }
}
