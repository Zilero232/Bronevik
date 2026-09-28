import type { Usage } from '@otmetki/schemas';

import { usageSchema } from '@otmetki/schemas';

import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

export const getUsage = (signal?: AbortSignal): Promise<Usage> =>
  fromServer(async () => {
    const { data } = await api.get('/me/usage', { ...SESSION_REQUEST, signal });

    return usageSchema.parse(data);
  });
