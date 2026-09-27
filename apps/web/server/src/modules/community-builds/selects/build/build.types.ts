import type { Prisma } from '../../../../../generated';
import type { BUILD_INCLUDE } from './build';

export type BuildRow = Prisma.BuildGetPayload<{ include: typeof BUILD_INCLUDE }>;
