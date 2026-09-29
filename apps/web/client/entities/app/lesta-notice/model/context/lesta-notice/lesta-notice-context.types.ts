import type { ServerEnv } from '@/shared/config/server-env';

export type LestaNoticeContextValue = Promise<ServerEnv['LESTA_NOTICE']>;
