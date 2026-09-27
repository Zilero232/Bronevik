import type { Prisma } from '../../../../../generated';
import type { COMPETITION_SUMMARY_INCLUDE } from './competition-summary';

export type CompetitionWithSummary = Prisma.CompetitionGetPayload<{ include: typeof COMPETITION_SUMMARY_INCLUDE }>;
