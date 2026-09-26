import type { Env } from '../env';

import { LESTA_MOCK } from './lesta-mock.constants';

export const isLestaMock = (env: Pick<Env, 'LESTA_MOCK'>): boolean => env.LESTA_MOCK === 'on';

export const lestaMockBaseUrl = (apiUrl: string): string => new URL(`${LESTA_MOCK.mountPath}${LESTA_MOCK.gamePath}`, apiUrl).toString();
