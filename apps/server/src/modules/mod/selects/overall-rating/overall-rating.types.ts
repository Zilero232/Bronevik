import type { Prisma } from '../../../../../generated';
import type { OVERALL_RATING_SELECT } from './overall-rating';

export type OverallRatingRow = Prisma.AccountRatingGetPayload<{ select: typeof OVERALL_RATING_SELECT }>;
