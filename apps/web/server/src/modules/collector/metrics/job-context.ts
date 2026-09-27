import { AsyncLocalStorage } from 'node:async_hooks';

import type { JobContext } from './metrics.types';

export const jobContext = new AsyncLocalStorage<JobContext>();
