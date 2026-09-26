import { createZodDto } from 'nestjs-zod';

import {
  createTournamentSchema,
  registerTournamentSchema,
  reportMatchSchema,
  tournamentPageSchema,
  tournamentSchema,
  tournamentsQuerySchema,
  withdrawTournamentSchema
} from './tournaments.schemas';

export class TournamentDto extends createZodDto(tournamentSchema) {}
export class TournamentsQueryDto extends createZodDto(tournamentsQuerySchema) {}
export class TournamentPageDto extends createZodDto(tournamentPageSchema) {}
export class CreateTournamentDto extends createZodDto(createTournamentSchema) {}
export class RegisterTournamentDto extends createZodDto(registerTournamentSchema) {}
export class ReportMatchDto extends createZodDto(reportMatchSchema) {}
export class WithdrawTournamentDto extends createZodDto(withdrawTournamentSchema) {}
