import { connection } from 'next/server';

import type { ServerEnv } from '@/shared/config/server-env';

import { serverEnv } from '@/shared/config/server-env';

export const readLestaNotice = async (): Promise<ServerEnv['LESTA_NOTICE']> => {
  await connection();

  return serverEnv().LESTA_NOTICE;
};
