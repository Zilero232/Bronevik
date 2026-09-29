import type { Prisma } from '../../../../generated';

export type InsensitiveEquals = Required<Pick<Prisma.StringFilter, 'equals' | 'mode'>>;
