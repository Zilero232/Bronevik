import type { CreateGuide, Guide, UpdateGuideInput } from '@/entities/guide/guide';

import { guidesControllerCreate, guidesControllerUpdate } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createGuide = (body: CreateGuide): Promise<Guide> => fromSdk(() => guidesControllerCreate({ ...SESSION_REQUEST, body }));

export const updateGuide = ({ id, body }: UpdateGuideInput): Promise<Guide> =>
  fromSdk(() => guidesControllerUpdate({ ...SESSION_REQUEST, path: { id }, body }));
