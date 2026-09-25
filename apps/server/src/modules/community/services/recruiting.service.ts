import { Injectable } from '@nestjs/common';

import type { Prisma, RecruitingPost } from '../../../../generated';
import type { CloseOwnInput, CreateRecruitingRequest, RecruitingPage, RecruitingQuery } from '../community.types';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { isRecruitingOfficer } from '../lib/clan-officer';
import { toRecruitingView } from '../lib/community-views';
import { CommunityAccountsService } from './community-accounts.service';

@Injectable()
export class RecruitingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService
  ) {}

  async list({ kind, clanId, limit, offset }: RecruitingQuery): Promise<RecruitingPage> {
    const now = new Date();
    const where: Prisma.RecruitingPostWhereInput = {
      status: 'open',
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      ...(kind ? { kind } : {}),
      ...(clanId === undefined ? {} : { clanId: BigInt(clanId) })
    };

    const [rows, total] = await Promise.all([
      this.prisma.recruitingPost.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      this.prisma.recruitingPost.count({ where })
    ]);

    return { items: await this.views(rows), total, limit, offset };
  }

  async create({ userId, kind, clanId, accountId, title, body, requirements, expiresInDays }: CreateRecruitingRequest) {
    const account = await this.accounts.accountOf({ userId, accountId });
    let postClanId: bigint | null = null;

    if (kind === 'clanSeeksPlayer') {
      if (clanId === undefined) {
        throw new AppBadRequestException('VALIDATION_FAILED', 'A clan post needs clanId');
      }

      const member = await this.prisma.clanMember.findUnique({ where: { accountId: account }, select: { clanId: true, role: true } });

      if (!member || member.clanId !== BigInt(clanId) || !isRecruitingOfficer(member.role)) {
        throw new AppForbiddenException('FORBIDDEN', 'Only clan officers can recruit for the clan');
      }

      postClanId = member.clanId;
    }

    const post = await this.prisma.recruitingPost.create({
      data: {
        kind,
        clanId: postClanId,
        accountId: kind === 'playerSeeksClan' ? account : null,
        authorUserId: userId,
        title,
        body,
        requirements: toJsonValue(requirements),
        expiresAt: new Date(Date.now() + expiresInDays * 86_400_000)
      }
    });

    const [view] = await this.views([post]);

    if (!view) {
      throw new AppNotFoundException('NOT_FOUND', 'The post disappeared');
    }

    return view;
  }

  async close({ id, userId }: CloseOwnInput): Promise<void> {
    const { count } = await this.prisma.recruitingPost.updateMany({
      where: { id, authorUserId: userId, status: 'open' },
      data: { status: 'closed' }
    });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No open recruiting post ${id} of yours`);
    }
  }

  async expire(now: Date): Promise<number> {
    const { count } = await this.prisma.recruitingPost.updateMany({
      where: { status: 'open', expiresAt: { lte: now } },
      data: { status: 'expired' }
    });

    return count;
  }

  private async views(rows: RecruitingPost[]) {
    const accountIds = rows.flatMap((row) => (row.accountId === null ? [] : [row.accountId]));
    const clanIds = rows.flatMap((row) => (row.clanId === null ? [] : [row.clanId]));
    const [stats, nicknames, clans] = await Promise.all([
      this.accounts.statsOf(accountIds),
      this.accounts.nicknamesOf(accountIds),
      clanIds.length === 0 ? [] : this.prisma.clan.findMany({ where: { clanId: { in: clanIds } }, select: { clanId: true, tag: true } })
    ]);

    const clanTags = new Map(clans.map((clan) => [clan.clanId, clan.tag]));

    return rows.map((post) => toRecruitingView({ post, stats, nicknames, clanTags }));
  }
}
