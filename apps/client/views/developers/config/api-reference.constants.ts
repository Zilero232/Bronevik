import { DEVELOPER_PATHS } from '@/entities/developer/developer';
import { env } from '@/shared/config';

import { apiUrl, apiVersion } from '../lib/api-url';

export const API_REFERENCE = {
  docsUrl: apiUrl({ baseUrl: env.NEXT_PUBLIC_API_URL, path: DEVELOPER_PATHS.docs }),
  specUrl: apiUrl({ baseUrl: env.NEXT_PUBLIC_API_URL, path: DEVELOPER_PATHS.spec }),
  version: apiVersion(DEVELOPER_PATHS.docs)
} as const;
