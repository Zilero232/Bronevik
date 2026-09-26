import type { CompetitionPage, CompetitionScoring, CompetitionSummary, Competition as CompetitionView } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { COMPETITION, competitionScoringSchema } from '@otmetki/schemas';

import type { Competition, Prisma } from '../../../../generated';
import type {
  CanViewInput,
  CompetitionCreateInput,
  CompetitionGetInput,
  CompetitionJoinInput,
  CompetitionListInput,
  CompetitionOwnedInput,
  NewTeamInput,
  TeamLookupInput,
  ToSummaryInput,
  ToViewInput
} from '../competitions.types';

import { AppBadRequestException, AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { randomCode } from '../../../common/lib';
import { isUniqueViolation, PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { titleSlug } from '../../community-core';
import { COMPETITION_RUN } from '../config';
import { competitionStatus, rankTeams } from '../lib/competition-scoring';
import { COMPETITION_SUMMARY_INCLUDE } from '../selects';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService
  ) {}

  async list({ query, viewerUserId }: CompetitionListInput): Promise<CompetitionPage> {
    const now = new Date();
    const visible: Prisma.CompetitionWhereInput = viewerUserId
      ? { OR: [{ visibility: 'public' }, { ownerUserId: viewerUserId }, { entries: { some: { userId: viewerUserId } } }] }
      : { visibility: 'public' };

    const mine: Prisma.CompetitionWhereInput =
      query.mine && viewerUserId ? { OR: [{ ownerUserId: viewerUserId }, { entries: { some: { userId: viewerUserId } } }] } : {};

    const status: Prisma.CompetitionWhereInput =
      query.status === 'upcoming'
        ? { startsAt: { gt: now } }
        : query.status === 'running'
          ? { startsAt: { lte: now }, endsAt: { gt: now } }
          : query.status === 'finished'
            ? { endsAt: { lte: now } }
            : {};

    if (query.mine && !viewerUserId) {
      return { items: [], total: 0, limit: query.limit, offset: query.offset };
    }

    const where: Prisma.CompetitionWhereInput = { AND: [visible, mine, status] };

    const [rows, total] = await Promise.all([
      this.prisma.competition.findMany({
        where,
        include: COMPETITION_SUMMARY_INCLUDE,
        orderBy: { startsAt: 'desc' },
        take: query.limit,
        skip: query.offset
      }),
      this.prisma.competition.count({ where })
    ]);

    return { items: rows.map((row) => this.toSummary({ row, now })), total, limit: query.limit, offset: query.offset };
  }

  async get({ slug, viewerUserId, code }: CompetitionGetInput): Promise<CompetitionView> {
    const row = await this.prisma.competition.findUnique({ where: { slug }, include: COMPETITION_SUMMARY_INCLUDE });

    if (!row || !(await this.canView({ competition: row, viewerUserId, code }))) {
      throw new AppNotFoundException('NOT_FOUND', `No competition ${slug}`);
    }

    return this.toView({ row, viewerUserId });
  }

  async create({ userId, scoring, ...input }: CompetitionCreateInput): Promise<CompetitionView> {
    if (input.visibility === 'private') {
      await this.entitlements.assertFeature({ userId, feature: COMPETITION_RUN.plusFeature });
    }

    const active = await this.prisma.competition.count({ where: { ownerUserId: userId, endsAt: { gt: new Date() } } });

    if (active >= COMPETITION_RUN.maxActivePerOwner) {
      throw new AppConflictException('CONFLICT', `At most ${COMPETITION_RUN.maxActivePerOwner} active competitions per organizer`);
    }

    const slug = titleSlug({
      title: input.title,
      suffix: randomCode({ alphabet: COMPETITION_RUN.slugSuffixAlphabet, length: COMPETITION_RUN.slugSuffixLength })
    });

    const row = await this.prisma.competition.create({
      data: {
        slug,
        ownerUserId: userId,
        title: input.title,
        description: input.description ?? null,
        visibility: input.visibility,
        mode: input.mode,
        battlesPerPlayer: input.battlesPerPlayer,
        minTier: input.minTier ?? null,
        scoring,
        inviteCode:
          input.visibility === 'private' ? randomCode({ alphabet: COMPETITION_RUN.inviteAlphabet, length: COMPETITION.inviteCodeLength }) : null,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt)
      },
      include: COMPETITION_SUMMARY_INCLUDE
    });

    return this.toView({ row, viewerUserId: userId });
  }

  async join({ id, userId, accountId, teamId, teamName, inviteCode }: CompetitionJoinInput): Promise<CompetitionView> {
    const competition = await this.prisma.competition.findUnique({ where: { id } });

    if (!competition || !(await this.canView({ competition, viewerUserId: userId, code: inviteCode }))) {
      throw new AppNotFoundException('NOT_FOUND', `No competition ${id}`);
    }

    if (competitionStatus({ startsAt: competition.startsAt, endsAt: competition.endsAt, now: new Date() }) === 'finished') {
      throw new AppConflictException('CONFLICT', 'The competition is over');
    }

    const link = await this.prisma.userLestaAccount.findFirst({ where: { userId, accountId: BigInt(accountId) }, select: { id: true } });

    if (!link) {
      throw new AppForbiddenException('FORBIDDEN', 'Only a Lesta account linked to you can take part');
    }

    const team = teamId
      ? await this.existingTeam({ competitionId: competition.id, teamId })
      : await this.newTeam({ competitionId: competition.id, name: teamName ?? '' });

    try {
      await this.prisma.competitionEntry.create({ data: { competitionId: competition.id, accountId: BigInt(accountId), teamId: team, userId } });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', 'This account already takes part');
      }

      throw error;
    }

    return this.byId({ id: competition.id, userId });
  }

  async leave({ id, userId }: CompetitionOwnedInput): Promise<CompetitionView> {
    const entries = await this.prisma.competitionEntry.findMany({ where: { competitionId: id, userId }, select: { teamId: true } });

    if (entries.length === 0) {
      throw new AppNotFoundException('NOT_FOUND', 'You do not take part in this competition');
    }

    await this.prisma.competitionEntry.deleteMany({ where: { competitionId: id, userId } });
    await this.prisma.competitionTeam.deleteMany({ where: { competitionId: id, entries: { none: {} } } });

    return this.byId({ id, userId });
  }

  async remove({ id, userId }: CompetitionOwnedInput): Promise<void> {
    const { count } = await this.prisma.competition.deleteMany({ where: { id, ownerUserId: userId } });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No competition ${id} of yours`);
    }
  }

  private async byId({ id, userId }: CompetitionOwnedInput): Promise<CompetitionView> {
    const row = await this.prisma.competition.findUniqueOrThrow({ where: { id }, include: COMPETITION_SUMMARY_INCLUDE });

    return this.toView({ row, viewerUserId: userId });
  }

  private async existingTeam({ competitionId, teamId: id }: TeamLookupInput): Promise<string> {
    const team = await this.prisma.competitionTeam.findFirst({
      where: { id, competitionId },
      select: { id: true, _count: { select: { entries: true } } }
    });

    if (!team) {
      throw new AppNotFoundException('NOT_FOUND', `No team ${id}`);
    }

    if (team._count.entries >= COMPETITION.maxTeamSize) {
      throw new AppConflictException('CONFLICT', 'The team is full');
    }

    return team.id;
  }

  private async newTeam({ competitionId, name }: NewTeamInput): Promise<string> {
    const teams = await this.prisma.competitionTeam.count({ where: { competitionId } });

    if (teams >= COMPETITION.maxTeams) {
      throw new AppConflictException('CONFLICT', 'The competition has no room for another team');
    }

    if (name.trim().length === 0) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'Name the new team');
    }

    try {
      return (await this.prisma.competitionTeam.create({ data: { competitionId, name: name.trim() }, select: { id: true } })).id;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', 'A team with this name already exists');
      }

      throw error;
    }
  }

  private async canView({ competition, viewerUserId, code }: CanViewInput): Promise<boolean> {
    if (competition.visibility === 'public' || competition.ownerUserId === viewerUserId) {
      return true;
    }

    if (code && competition.inviteCode && code.toUpperCase() === competition.inviteCode) {
      return true;
    }

    if (!viewerUserId) {
      return false;
    }

    return (await this.prisma.competitionEntry.count({ where: { competitionId: competition.id, userId: viewerUserId } })) > 0;
  }

  private toSummary({ row, now }: ToSummaryInput): CompetitionSummary {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      visibility: row.visibility,
      mode: row.mode,
      battlesPerPlayer: row.battlesPerPlayer,
      minTier: row.minTier,
      status: competitionStatus({ startsAt: row.startsAt, endsAt: row.endsAt, now }),
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      teams: row._count.teams,
      participants: row._count.entries,
      organizer: row.owner.name || null,
      leader: row.teams[0] && row.teams[0].score > 0 ? row.teams[0].name : null
    };
  }

  private async toView({ row, viewerUserId }: ToViewInput): Promise<CompetitionView> {
    const teams = await this.prisma.competitionTeam.findMany({
      where: { competitionId: row.id },
      include: { entries: { orderBy: { score: 'desc' } } },
      orderBy: { createdAt: 'asc' }
    });

    const accountIds = teams.flatMap((team) => team.entries.map((entry) => entry.accountId));
    const players = await this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, select: { accountId: true, nickname: true } });
    const nicknameOf = new Map(players.map((player) => [player.accountId, player.nickname]));
    const ranks = rankTeams(teams);
    const isOwner = row.ownerUserId === viewerUserId;
    const myTeam = viewerUserId ? teams.find((team) => team.entries.some((entry) => entry.userId === viewerUserId)) : undefined;

    return {
      ...this.toSummary({ row, now: new Date() }),
      scoring: this.scoringOf(row),
      maxTeamSize: COMPETITION.maxTeamSize,
      isOwner,
      myTeamId: myTeam?.id ?? null,
      inviteCode: isOwner ? row.inviteCode : null,
      scoredAt: row.scoredAt?.toISOString() ?? null,
      standings: teams
        .map((team) => ({
          id: team.id,
          name: team.name,
          rank: ranks.get(team.id) ?? teams.length,
          score: team.score,
          battles: team.battles,
          members: team.entries.map((entry) => ({
            accountId: Number(entry.accountId),
            nickname: nicknameOf.get(entry.accountId) ?? null,
            battles: entry.battles,
            score: entry.score,
            source: entry.source
          }))
        }))
        .sort((left, right) => left.rank - right.rank)
    };
  }

  private scoringOf(row: Competition): CompetitionScoring {
    const parsed = competitionScoringSchema.safeParse(row.scoring);

    return parsed.success ? parsed.data : COMPETITION.defaultScoring;
  }
}
