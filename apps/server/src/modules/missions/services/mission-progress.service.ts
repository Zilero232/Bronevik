import type { MissionProgress, MissionProgressItem } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { PlanProgress } from '../lib/mission-plan';
import type { NextMissions, UpdateProgressInput } from '../missions.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { MISSION_PLAN } from '../config';
import { planOperation } from '../lib/mission-plan';
import { readConditions, toProgressItem } from '../mappers';
import { MissionCatalogService } from './mission-catalog.service';

@Injectable()
export class MissionProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: MissionCatalogService
  ) {}

  async list(userId: string): Promise<MissionProgress> {
    const rows = await this.prisma.userMissionProgress.findMany({ where: { userId }, orderBy: { questId: 'asc' } });

    return { items: rows.map(toProgressItem) };
  }

  async update({ userId, questId, done, honors }: UpdateProgressInput): Promise<MissionProgressItem> {
    const exists = await this.prisma.mission.findFirst({ where: { questId }, select: { questId: true } });

    if (!exists) {
      throw new AppNotFoundException('NOT_FOUND', `No mission ${questId}`);
    }

    const state = { done: done || honors, honors, source: 'manual' as const };
    const row = await this.prisma.userMissionProgress.upsert({
      where: { userId_questId: { userId, questId } },
      create: { userId, questId, ...state },
      update: state
    });

    return toProgressItem(row);
  }

  async progressMap(userId: string): Promise<Map<number, PlanProgress>> {
    const rows = await this.prisma.userMissionProgress.findMany({ where: { userId }, select: { questId: true, done: true, honors: true } });

    return new Map(rows.map((row) => [row.questId, { done: row.done, honors: row.honors }]));
  }

  async next(userId: string): Promise<NextMissions | null> {
    const version = await this.catalog.currentVersion();

    if (!version) {
      return null;
    }

    const latest = await this.prisma.userMissionProgress.findFirst({ where: { userId }, orderBy: { updatedAt: 'desc' }, select: { questId: true } });
    const anchor = latest
      ? await this.prisma.mission.findUnique({ where: { gameVersionId_questId: { gameVersionId: version.id, questId: latest.questId } } })
      : await this.prisma.mission.findFirst({ where: { gameVersionId: version.id }, orderBy: { questId: 'asc' } });

    if (!anchor) {
      return null;
    }

    const [rows, progress] = await Promise.all([this.catalog.operationById(anchor.operationId), this.progressMap(userId)]);
    const byQuest = new Map(rows.missions.map((mission) => [mission.questId, mission]));
    const steps = planOperation({
      branches: rows.branches.map((branch) => ({
        chainId: branch.chainId,
        key: branch.key,
        missions: rows.missions.filter((mission) => mission.chainId === branch.chainId)
      })),
      progress
    });

    const firstPerBranch = steps.filter((step, index) => steps.findIndex((other) => other.chainId === step.chainId) === index);

    return {
      operationName: rows.operation.name ?? `#${rows.operation.operationId}`,
      campaignId: rows.operation.campaignId,
      operationId: rows.operation.operationId,
      missions: firstPerBranch.slice(0, MISSION_PLAN.telegramNextLimit).map((step) => {
        const main = readConditions(byQuest.get(step.questId)?.conditions ?? null).find((condition) => condition.isMain && condition.description);

        return { branchKey: step.branchKey, title: step.title, condition: main?.description ?? null };
      })
    };
  }
}
