import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import type { Prisma } from '../../../../generated';
import type {
  CloseOwnInput,
  CreateTournamentRequest,
  RegisterTournamentRequest,
  ReportMatchRequest,
  TournamentMove,
  TournamentPage,
  TournamentsQuery,
  TournamentView
} from '../community.types';
import type { Bracket, TournamentWithParticipants } from '../lib';

import { AppBadRequestException, AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { isUniqueViolation, PrismaService } from '../../../core';
import { TOURNAMENT } from '../config';
import { bracketSchema } from '../dto/community.schemas';
import { BracketError, guideSlug, readRequirements, reportWinner, seedBracket, toTournamentView, unmetRequirements } from '../lib';
import { CommunityAccountsService } from './community-accounts.service';

@Injectable()
export class TournamentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService
  ) {}

  async list({ status, limit, offset }: TournamentsQuery): Promise<TournamentPage> {
    const where: Prisma.TournamentWhereInput = status ? { status } : { status: { not: 'draft' } };
    const [rows, total] = await Promise.all([
      this.prisma.tournament.findMany({ where, orderBy: { startsAt: 'desc' }, take: limit, skip: offset, include: { participants: true } }),
      this.prisma.tournament.count({ where })
    ]);

    return { items: await Promise.all(rows.map((row) => this.view(row))), total, limit, offset };
  }

  async get(slug: string): Promise<TournamentView> {
    return this.view(await this.bySlug(slug));
  }

  async create({ userId, title, description, requirements, maxParticipants, registrationEndsAt, startsAt }: CreateTournamentRequest) {
    const tournament = await this.prisma.tournament.create({
      data: {
        organizerUserId: userId,
        slug: guideSlug({ title, suffix: randomBytes(3).toString('hex') }),
        title,
        description: description ?? null,
        requirements,
        rules: { maxParticipants },
        registrationEndsAt: registrationEndsAt ? new Date(registrationEndsAt) : null,
        startsAt: new Date(startsAt)
      },
      include: { participants: true }
    });

    return this.view(tournament);
  }

  async openRegistration({ id, userId }: CloseOwnInput): Promise<TournamentView> {
    return this.move({ id, userId, from: 'draft', to: 'registration' });
  }

  async cancel({ id, userId }: CloseOwnInput): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });

    if (tournament.status === 'finished') {
      throw new AppConflictException('CONFLICT', 'A finished tournament cannot be cancelled');
    }

    return this.view(await this.prisma.tournament.update({ where: { id }, data: { status: 'cancelled' }, include: { participants: true } }));
  }

  async register({ id, userId, accountId, teamName }: RegisterTournamentRequest): Promise<TournamentView> {
    const tournament = await this.prisma.tournament.findUnique({ where: { id }, include: { participants: true } });

    if (!tournament) {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${id}`);
    }

    if (tournament.status !== 'registration' || (tournament.registrationEndsAt && tournament.registrationEndsAt <= new Date())) {
      throw new AppConflictException('CONFLICT', 'Registration is closed');
    }

    if (tournament.participants.length >= this.capacity(tournament)) {
      throw new AppConflictException('CONFLICT', 'The tournament is full');
    }

    const account = await this.accounts.accountOf({ userId, accountId });
    const stats = (await this.accounts.statsOf([account])).get(account) ?? null;
    const unmet = unmetRequirements({ stats, requirements: readRequirements(tournament.requirements) });

    if (unmet.length > 0) {
      throw new AppForbiddenException('FORBIDDEN', `Requirements not met: ${unmet.join(', ')}`);
    }

    try {
      await this.prisma.tournamentParticipant.create({ data: { tournamentId: id, accountId: account, teamName: teamName ?? null, verified: true } });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', 'Already registered');
      }

      throw error;
    }

    return this.view(await this.prisma.tournament.findUniqueOrThrow({ where: { id }, include: { participants: true } }));
  }

  async start({ id, userId }: CloseOwnInput): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });

    if (tournament.status !== 'registration') {
      throw new AppConflictException('CONFLICT', 'Only a tournament in registration can start');
    }

    if (tournament.participants.length < TOURNAMENT.minParticipants) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'Not enough participants');
    }

    const stats = await this.accounts.statsOf(tournament.participants.map((participant) => participant.accountId));
    const seeded = [...tournament.participants].sort((a, b) => (stats.get(b.accountId)?.wn8 ?? 0) - (stats.get(a.accountId)?.wn8 ?? 0));

    await this.prisma.$transaction(
      seeded.map((participant, index) =>
        this.prisma.tournamentParticipant.update({
          where: { tournamentId_accountId: { tournamentId: id, accountId: participant.accountId } },
          data: { seed: index + 1 }
        })
      )
    );

    const bracket = seedBracket(seeded.map((participant) => Number(participant.accountId)));

    return this.view(await this.prisma.tournament.update({ where: { id }, data: { status: 'running', bracket }, include: { participants: true } }));
  }

  async reportMatch({ id, userId, round, index, winner }: ReportMatchRequest): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });
    const current = this.bracketOf(tournament);

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

    const finished = bracket.rounds.at(-1)?.[0]?.winner !== null;

    return this.view(
      await this.prisma.tournament.update({
        where: { id },
        data: { bracket, ...(finished ? { status: 'finished' } : {}) },
        include: { participants: true }
      })
    );
  }

  private async move({ id, userId, from, to }: TournamentMove): Promise<TournamentView> {
    const tournament = await this.organized({ id, userId });

    if (tournament.status !== from) {
      throw new AppConflictException('CONFLICT', `The tournament is ${tournament.status}, not ${from}`);
    }

    return this.view(await this.prisma.tournament.update({ where: { id }, data: { status: to }, include: { participants: true } }));
  }

  private async organized({ id, userId }: CloseOwnInput): Promise<TournamentWithParticipants> {
    const tournament = await this.prisma.tournament.findFirst({ where: { id, organizerUserId: userId }, include: { participants: true } });

    if (!tournament) {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${id} of yours`);
    }

    return tournament;
  }

  private async bySlug(slug: string): Promise<TournamentWithParticipants> {
    const tournament = await this.prisma.tournament.findUnique({ where: { slug }, include: { participants: true } });

    if (!tournament || tournament.status === 'draft') {
      throw new AppNotFoundException('NOT_FOUND', `No tournament ${slug}`);
    }

    return tournament;
  }

  private bracketOf(tournament: TournamentWithParticipants): Bracket | null {
    const parsed = bracketSchema.safeParse(tournament.bracket);

    return parsed.success ? parsed.data : null;
  }

  private capacity(tournament: TournamentWithParticipants): number {
    const rules = tournament.rules;
    const value = rules && typeof rules === 'object' && !Array.isArray(rules) ? rules.maxParticipants : null;

    return typeof value === 'number' ? value : TOURNAMENT.maxParticipants;
  }

  private async view(tournament: TournamentWithParticipants): Promise<TournamentView> {
    const nicknames = await this.accounts.nicknamesOf(tournament.participants.map((participant) => participant.accountId));

    return toTournamentView({ tournament, nicknames, bracket: this.bracketOf(tournament), maxParticipants: this.capacity(tournament) });
  }
}
