import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { createHash } from 'node:crypto';

import type { BonusCodeView, DiscoverBonusCodeInput, ListBonusCodesInput, RecountInput, ReportBonusCodeInput } from '../shop.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { isUniqueViolation, PrismaService } from '../../../core';
import { NotificationService } from '../../notifications';
import { BONUS_CODE } from '../config';
import { bonusCodeStatus } from '../lib';
import { toBonusCodeView, VERDICT_TO_DB } from '../mappers';

@Injectable()
export class BonusCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService
  ) {}

  async list({ status }: ListBonusCodesInput): Promise<BonusCodeView[]> {
    const rows = await this.prisma.bonusCode.findMany({
      where: status ? { status } : {},
      orderBy: [{ discoveredAt: 'desc' }, { code: 'asc' }],
      take: 200
    });

    return rows.map(toBonusCodeView);
  }

  async discover({ code, title, source, sourceUrl, expiresAt }: DiscoverBonusCodeInput): Promise<boolean> {
    try {
      await this.prisma.bonusCode.create({ data: { code, title, source, sourceUrl, expiresAt } });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return false;
      }

      throw error;
    }

    await this.notifications.bonusCodePublished({ code, description: title });

    return true;
  }

  async report({ userId, code, verdict, ip }: ReportBonusCodeInput): Promise<BonusCodeView> {
    const exists = await this.prisma.bonusCode.findUnique({ where: { code }, select: { code: true } });

    if (!exists) {
      throw new AppNotFoundException('NOT_FOUND', `Unknown bonus code ${code}`);
    }

    const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null;

    await this.prisma.bonusCodeReport.upsert({
      where: { code_userId: { code, userId } },
      create: { code, userId, verdict: VERDICT_TO_DB[verdict], ipHash },
      update: { verdict: VERDICT_TO_DB[verdict], ipHash, createdAt: new Date() }
    });

    return toBonusCodeView(await this.recount({ code, now: new Date() }));
  }

  async refreshStatuses(now: Date): Promise<number> {
    const staleBefore = subDays(now, BONUS_CODE.staleAfterDays);
    const stale = await this.prisma.bonusCode.updateMany({
      where: { status: { not: 'expired' }, discoveredAt: { lt: staleBefore }, lastReportAt: null },
      data: { status: 'expired' }
    });

    const open = await this.prisma.bonusCode.findMany({ where: { status: { not: 'expired' } }, select: { code: true } });

    for (const { code } of open) {
      await this.recount({ code, now });
    }

    return stale.count + open.length;
  }

  private async recount({ code, now }: RecountInput) {
    const since = subDays(now, BONUS_CODE.reportWindowDays);
    const [counts, latest, current] = await Promise.all([
      this.prisma.bonusCodeReport.groupBy({ by: ['verdict'], where: { code, createdAt: { gte: since } }, _count: { _all: true } }),
      this.prisma.bonusCodeReport.findFirst({ where: { code }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.bonusCode.findUniqueOrThrow({ where: { code }, select: { expiresAt: true } })
    ]);

    const countOf = (verdict: 'expired' | 'working') => counts.find((row) => row.verdict === verdict)?._count._all ?? 0;
    const working = countOf('working');
    const expired = countOf('expired');

    return this.prisma.bonusCode.update({
      where: { code },
      data: {
        workingReports: working,
        expiredReports: expired,
        lastReportAt: latest?.createdAt ?? null,
        status: bonusCodeStatus({ working, expired, expiresAt: current.expiresAt, now })
      }
    });
  }
}
