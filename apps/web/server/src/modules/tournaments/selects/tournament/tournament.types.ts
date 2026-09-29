import type { Prisma } from '../../../../../generated';
import type { TOURNAMENT_INCLUDE } from './tournament';

export type TournamentWithParticipants = Prisma.TournamentGetPayload<{ include: typeof TOURNAMENT_INCLUDE }>;
