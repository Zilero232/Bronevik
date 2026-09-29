import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { sortBy } from 'remeda';

import type { Prisma } from '../../../../generated';
import type { OwnedById } from '../../community-core';
import type { Bracket } from '../lib';
import type { TournamentWithParticipants } from '../selects';
import type {
  CreateTournamentRequest,
  OrganizedInput,
  RegisterTournamentRequest,
  ReportMatchRequest,
  TournamentMove,
  TournamentPage,
  TournamentsQuery,
  TournamentView,
  TournamentViewWith,
  ViewTournamentInput,
  WithdrawTournamentRequest
} from '../tournaments.types';

import { AppBadRequestException, AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { isTransactionConflict, isUniqueViolation, PrismaService } from '../../../core';
import { CommunityAccountsService, readRequirements, titleSlug, unmetRequirements } from '../../community-core';
import { TOURNAMENT } from '../config';
import { BracketError, champion, reportWinner, seedBracket, storedBracket, storedCapacity } from '../lib';
import { toTournamentView } from '../mappers';
import { participantSeedsSql } from '../queries';
import { TOURNAMENT_INCLUDE } from '../selects';

@Injectable()
export class TournamentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService
  ) {}

  async list({ status, limit, offset }: TournamentsQuery): Promise<TournamentPage> {
    const where: Prisma.TournamentWhereInput = { AND: [{ status: { not: 'draft' } }, ...(status ? [{ status }] : [])] };
    const [rows, total] = await Promise.all([
      this.prisma.tournament.findMany({ where, orderBy: { startsAt: 'desc' }, take: limit, skip: offset, include: TOURNAMENT_INCLUDE }),
      this.prisma.tournament.count({ where })
    ]);

    const nicknames = await this.accounts.nicknamesOf(rows.flatMap((row) => row.participants.map((participant) => participant.accountId)));

    return { items: rows.map((tournament) => this.viewWith({ tournament, nicknames })), total, limit, offset };
  }

  async get({ slug, viewerUserId }: ViewTournamentInput): Promise<TournamentView> {
    return this.view(await this.bySlug({ slug, viewerUserId }));
  }

  async create({
    userId,
    title,
    description,
    requirements,
    maxParticipants,
    registrationEndsAt,
    startsAt,
    openRegistration
  }: CreateTournamentRequest): Promise<TournamentView> {
    const starts = new Date(startsAt);
    const registrationEnds = registrationEndsAt ? new Date(registrationEndsAt) : null;

    if (starts <= new Date() || (registrationEnds && registrationEnds > starts)) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'A tournament starts in the future and closes registration no later than its start');
    }

    const tournament = await this.prisma.tournament.create({
      data: {
        organizerUserId: userId,
        slug: titleSlug({ title, suffix: randomBytes(3).toString('hex') }),
        title,
        description: description ?? null,
        requirements,
        rules: { maxParticipants },
        registrationEndsAt: registrationEnds,
        startsAt: starts,
        status: openRegistration ? 'registration' : 'draft'
      },
      include: TOURNAMENT_INCLUDE
    });

    return this.view(tournament);
  }

  async openRegistration({ id, userId }: OwnedById): Promise<TournamentView> {
    return this.move({ id, userId, from: 'draft', to: 'registration' });
  }

  async cancel({ id, userId }: OwnedById): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });

    if (tournament.status === 'finished') {
      throw new AppConflictException('CONFLICT', 'A finished tournament cannot be cancelled');
    }

    return this.view(await this.prisma.tournament.update({ where: { id }, data: { status: 'cancelled' }, include: TOURNAMENT_INCLUDE }));
  }

  async register({ id, userId, accountId, teamName }: RegisterTournamentRequest): Promise<TournamentView> {
    const tournament = await this.prisma.tournament.findUnique({ where: { id }, include: TOURNAMENT_INCLUDE });

    if (!tournament) {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${id}`);
    }

    this.assertOpen(tournament);

    const account = await this.accounts.accountOf({ userId, accountId });
    const stats = (await this.accounts.statsOf([account])).get(account) ?? null;
    const unmet = unmetRequirements({ stats, requirements: readRequirements(tournament.requirements) });

    if (unmet.length > 0) {
      throw new AppForbiddenException('FORBIDDEN', `Requirements not met: ${unmet.join(', ')}`);
    }

    try {
      await this.prisma.$transaction(
        async (tx) => {
          const current = await tx.tournament.findUniqueOrThrow({ where: { id }, include: TOURNAMENT_INCLUDE });

          this.assertOpen(current);
          await tx.tournamentParticipant.create({ data: { tournamentId: id, accountId: account, teamName: teamName ?? null, verified: true } });
        },
        { isolationLevel: 'Serializable' }
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', 'Already registered');
      }

      if (isTransactionConflict(error)) {
        throw new AppConflictException('CONFLICT', 'Registration changed concurrently, try again');
      }

      throw error;
    }

    return this.view(await this.prisma.tournament.findUniqueOrThrow({ where: { id }, include: TOURNAMENT_INCLUDE }));
  }

  async withdraw({ id, userId, accountId }: WithdrawTournamentRequest): Promise<TournamentView> {
    const account = await this.accounts.accountOf({ userId, accountId });

    const withdrawn = await this.serializable(async (tx) => {
      const tournament = await tx.tournament.findUnique({ where: { id }, select: { status: true } });

      if (!tournament) {
        throw new AppNotFoundException('NOT_FOUND', `No tournament ${id}`);
      }

      if (tournament.status !== 'registration') {
        throw new AppConflictException('CONFLICT', 'You can withdraw only while registration is open');
      }

      const { count } = await tx.tournamentParticipant.deleteMany({ where: { tournamentId: id, accountId: account } });

      if (count === 0) {
        throw new AppNotFoundException('NOT_FOUND', 'You are not registered for this tournament');
      }

      return tx.tournament.findUniqueOrThrow({ where: { id }, include: TOURNAMENT_INCLUDE });
    });

    return this.view(withdrawn);
  }

  async start({ id, userId }: OwnedById): Promise<TournamentView> {
    const started = await this.serializable(async (tx) => {
      const tournament = await this.organized({ db: tx, id, userId });

      if (tournament.status !== 'registration') {
        throw new AppConflictException('CONFLICT', 'Only a tournament in registration can start');
      }

      if (tournament.participants.length < TOURNAMENT.minParticipants) {
        throw new AppBadRequestException('VALIDATION_FAILED', 'Not enough participants');
      }

      const stats = await this.accounts.statsOf(tournament.participants.map((participant) => participant.accountId));
      const seeded = sortBy(tournament.participants, [(participant) => stats.get(participant.accountId)?.wn8 ?? 0, 'desc']);

      await tx.$executeRaw(participantSeedsSql({ tournamentId: id, seededAccountIds: seeded.map((participant) => participant.accountId) }));

      const bracket = seedBracket(seeded.map((participant) => Number(participant.accountId)));

      return tx.tournament.update({ where: { id }, data: { status: 'running', bracket }, include: TOURNAMENT_INCLUDE });
    });

    return this.view(started);
  }

  async reportMatch({ id, userId, round, index, winner }: ReportMatchRequest): Promise<TournamentView> {
    const reported = await this.serializable(async (tx) => {
      const tournament = await this.organized({ db: tx, id, userId });
      const current = storedBracket(tournament.bracket);

      if (tournament.status !== 'running' || !current) {
        throw new AppConflictException('CONFLICT', 'The tournament is not running');
      }

      let bracket: Bracket;

      try {
        bracket = reportWinner({ bracket: current, round, index, winner });
      } catch (error) {
        if (error instanceof BracketError) {
          throw new AppBadRequestException('VALIDATION_FAILED', error.message);
        }

        throw error;
      }

      const finished = champion(bracket) !== null;

      return tx.tournament.update({
        where: { id },
        data: { bracket, ...(finished ? { status: 'finished' } : {}) },
        include: TOURNAMENT_INCLUDE
      });
    });

    return this.view(reported);
  }

  private async move({ id, userId, from, to }: TournamentMove): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });

    if (tournament.status !== from) {
      throw new AppConflictException('CONFLICT', `The tournament is ${tournament.status}, not ${from}`);
    }

    return this.view(await this.prisma.tournament.update({ where: { id }, data: { status: to }, include: TOURNAMENT_INCLUDE }));
  }

  private async serializable<T>(run: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(run, { isolationLevel: 'Serializable' });
    } catch (error) {
      if (isTransactionConflict(error)) {
        throw new AppConflictException('CONFLICT', 'The tournament changed concurrently, try again');
      }

      throw error;
    }
  }

  private async organized({ db = this.prisma, id, userId }: OrganizedInput): Promise<TournamentWithParticipants> {
    const tournament = await db.tournament.findFirst({ where: { id, organizerUserId: userId }, include: TOURNAMENT_INCLUDE });

    if (!tournament) {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${id} of yours`);
    }

    return tournament;
  }

  private async bySlug({ slug, viewerUserId }: ViewTournamentInput): Promise<TournamentWithParticipants> {
    const tournament = await this.prisma.tournament.findUnique({ where: { slug }, include: TOURNAMENT_INCLUDE });

    if (!tournament || (tournament.status === 'draft' && tournament.organizerUserId !== viewerUserId)) {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${slug}`);
    }

    return tournament;
  }

  private assertOpen(tournament: TournamentWithParticipants): void {
    if (tournament.status !== 'registration' || (tournament.registrationEndsAt ?? tournament.startsAt) <= new Date()) {
      throw new AppConflictException('CONFLICT', 'Registration is closed');
    }

    if (tournament.participants.length >= storedCapacity(tournament.rules)) {
      throw new AppConflictException('CONFLICT', 'The tournament is full');
    }
  }

  private async view(tournament: TournamentWithParticipants): Promise<TournamentView> {
    const nicknames = await this.accounts.nicknamesOf(tournament.participants.map((participant) => participant.accountId));

    return this.viewWith({ tournament, nicknames });
  }

  private viewWith({ tournament, nicknames }: TournamentViewWith): TournamentView {
    return toTournamentView({ tournament, nicknames, bracket: storedBracket(tournament.bracket), maxParticipants: storedCapacity(tournament.rules) });
  }
}
