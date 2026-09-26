import type { Build as BuildView, CreateBuildInput } from '@otmetki/schemas';
import type { z } from 'zod';

import type { Prisma } from '../../../generated';
import type { Owned, OwnedById, Viewer } from '../community-core';
import type { buildPageSchema, buildsQuerySchema, updateBuildSchema } from './dto/community-builds.schemas';
import type { BUILD_INCLUDE } from './selects';

export type { BuildView };

export type BuildsQuery = z.output<typeof buildsQuerySchema> & Viewer;
export type BuildPage = z.infer<typeof buildPageSchema>;
export type CreateBuildRequest = CreateBuildInput & Owned;
export type UpdateBuildRequest = z.output<typeof updateBuildSchema> & OwnedById;
export type PopularBuildsInput = { tankId: number } & Viewer;
export type BuildRow = Prisma.BuildGetPayload<{ include: typeof BUILD_INCLUDE }>;
export type BuildViewsInput = { rows: BuildRow[] } & Viewer;
