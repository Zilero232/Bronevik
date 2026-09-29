import { Injectable } from '@nestjs/common';
import { addHours, max } from 'date-fns';

import type { EntryScore, ScoreCompetitionInput, ScoreEntryInput } from '../competitions.types';
import type { CompetitionBattleRow } from '../queries';

import { bonusTypesOfMode, moscowDayStart } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { NotificationService } from '../../notifications';
import { VehicleCatalogService } from '../../reference';
import { COMPETITION_RUN } from '../config';
import { rankTeams, readScoring, scoreBattles, scoreTotals, teamTotals } from '../lib';
import { toScoredLine } from '../mappers';
import { competitionBattlesSql } from '../queries';

@Injectable()
export class CompetitionScoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly notifications: NotificationService
  ) {}

  async run(now = new Date()): Promise<number> {
    const competitions = await this.prisma.competition.findMany({ where: { startsAt: { lte: now }, finishedAt: null } });

    for (const competition of competitions) {
      await this.score({ competition, now });
    }

    return competitions.length;
  }

  private async score({ competition, now }: ScoreCompetitionInput): Promise<void> {
    const entries = await this.prisma.competitionEntry.findMany({ where: { competitionId: competition.id } });
    const catalog = competition.minTier === null ? null : await this.catalog.all();
    const results: (EntryScore & Pick<ScoreEntryInput, 'accountId'>)[] = [];

    for (const entry of entries) {
      results.push({
        accountId: entry.accountId,
        ...(await this.scoreEntry({ competition, catalog, accountId: entry.accountId, joinedAt: entry.joinedAt }))
      });
    }

    if (results.length > 0) {
      await this.prisma.$transaction(
        results.map(({ accountId, score, battles, source }) =>
          this.prisma.competitionEntry.update({
            where: { competitionId_accountId: { competitionId: competition.id, accountId } },
            data: { score, battles, source }
          })
        )
      );
    }

    const teams = await this.prisma.competitionTeam.findMany({
      where: { competitionId: competition.id },
      include: { entries: { select: { score: true, battles: true, userId: true } } }
    });

    const totals = teams.map((team) => ({
      id: team.id,
      name: team.name,
      ...teamTotals(team.entries),
      userIds: [...new Set(team.entries.map((entry) => entry.userId))]
    }));

    const isFinal = now >= addHours(competition.endsAt, COMPETITION_RUN.finishGraceHours);

    await this.prisma.$transaction([
      ...totals.map((team) => this.prisma.competitionTeam.update({ where: { id: team.id }, data: { score: team.score, battles: team.battles } })),
      this.prisma.competition.update({ where: { id: competition.id }, data: { scoredAt: now, ...(isFinal ? { finishedAt: now } : {}) } })
    ]);

    if (!isFinal) {
      return;
    }

    const ranks = rankTeams(totals);

    for (const team of totals) {
      await this.notifications.notifyMany({
        userIds: team.userIds,
        notification: {
          event: 'competitionFinished',
          competitionSlug: competition.slug,
          title: competition.title,
          teamName: team.name,
          rank: ranks.get(team.id) ?? totals.length,
          teams: Math.max(totals.length, 1)
        },
        dedupeKey: `competition-${competition.id}`
      });
    }
  }

  private async scoreEntry({ competition, catalog, accountId, joinedAt }: ScoreEntryInput): Promise<EntryScore> {
    const scoring = readScoring(competition.scoring);
    const from = max([competition.startsAt, joinedAt]);
    const limit = competition.battlesPerPlayer;

    const battleTypes = bonusTypesOfMode(competition.mode);

    const battles =
      battleTypes.length === 0
        ? []
        : await this.prisma.$queryRaw<CompetitionBattleRow[]>(
            competitionBattlesSql({ accountId, battleTypes, from, until: competition.endsAt, limit: limit * COMPETITION_RUN.battlesFetchFactor })
          );

    const eligible = battles.filter((battle) => !catalog || (catalog.get(battle.tankId)?.summary.tier ?? 0) >= (competition.minTier ?? 0));

    if (eligible.length > 0) {
      const lines = eligible.map(toScoredLine);

      return { ...scoreBattles({ battles: lines, scoring, limit }), source: 'mod' };
    }

    if (competition.mode !== 'random' || competition.minTier !== null) {
      return { score: 0, battles: 0, source: 'none' };
    }

    const sessions = await this.prisma.playSession.aggregate({
      where: { accountId, source: 'api', kind: 'day', startedAt: { gte: moscowDayStart(from), lt: competition.endsAt } },
      _sum: {
        battles: true,
        wins: true,
        damageDealt: true,
        damageAssisted: true,
        damageBlocked: true,
        frags: true,
        spotted: true,
        xp: true,
        survived: true
      }
    });

    const total = sessions._sum.battles ?? 0;

    if (total === 0) {
      return { score: 0, battles: 0, source: 'none' };
    }

    return {
      ...scoreTotals({
        totals: {
          damage: sessions._sum.damageDealt ?? 0,
          assist: sessions._sum.damageAssisted ?? 0,
          blocked: sessions._sum.damageBlocked ?? 0,
          frags: sessions._sum.frags ?? 0,
          spotted: sessions._sum.spotted ?? 0,
          xp: sessions._sum.xp ?? 0,
          wins: sessions._sum.wins ?? 0,
          survived: sessions._sum.survived ?? 0
        },
        battles: total,
        scoring,
        limit
      }),
      source: 'snapshots'
    };
  }
}
