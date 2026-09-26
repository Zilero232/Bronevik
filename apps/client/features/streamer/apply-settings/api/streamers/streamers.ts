import type { ApplyRequest, CreateApplyRequestInput } from '@otmetki/schemas';

import { createApplyRequestSchema } from '@otmetki/schemas';

import { streamersControllerRequestApply } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const requestSettingsApply = (input: CreateApplyRequestInput): Promise<ApplyRequest> =>
  fromSdk(() => streamersControllerRequestApply({ ...SESSION_REQUEST, body: createApplyRequestSchema.parse(input) }));
