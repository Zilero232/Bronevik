import type { z } from 'zod';

import type { Prisma, TournamentStatus } from '../../../generated';
import type { PrismaService } from '../../core';
import type { NamesById, Owned, OwnedById } from '../community-core';
import type {
  createTournamentSchema,
  registerTournamentSchema,
  reportMatchSchema,
  tournamentPageSchema,
  tournamentSchema,
  tournamentsQuerySchema
} from './dto/tournaments.schemas';
import type { TournamentWithParticipants } from './lib';

export type TournamentView = z.infer<typeof tournamentSchema>;
export type TournamentsQuery = z.output<typeof tournamentsQuerySchema>;
export type TournamentPage = z.infer<typeof tournamentPageSchema>;
export type CreateTournamentRequest = z.output<typeof createTournamentSchema> & Owned;
export type RegisterTournamentRequest = z.output<typeof registerTournamentSchema> & OwnedById;
export type ReportMatchRequest = z.output<typeof reportMatchSchema> & OwnedById;

export type TournamentMove = OwnedById & {
  from: TournamentStatus;
  to: TournamentStatus;
};

export type OrganizedInput = OwnedById & {
  db?: Prisma.TransactionClient | PrismaService;
};

export type TournamentViewWith = {
  tournament: TournamentWithParticipants;
  nicknames: NamesById;
};
