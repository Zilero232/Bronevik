import { env } from '@/shared/config';

import { trimBaseUrl } from '../lib/api-url';
import { quickstartSamples } from '../lib/code-samples';

export const QUICKSTART = {
  steps: ['key', 'install', 'request'],
  baseUrl: trimBaseUrl(env.NEXT_PUBLIC_API_URL),
  samples: quickstartSamples(env.NEXT_PUBLIC_API_URL)
} as const;
