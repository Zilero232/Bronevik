import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { LestaClients, LestaOutcomeRecorder } from './lesta.types';

import { AppConfigService, LESTA } from '../../config';
import { REDIS } from '../redis';
import { LESTA_CLIENT, LESTA_CLIENTS, LESTA_OUTCOME_RECORDER } from './lesta.constants';
import { createLestaClients, meteredFetch } from './lesta.factory';

@Global()
@Module({
  providers: [
    {
      provide: LESTA_CLIENTS,
      inject: [AppConfigService, REDIS, { token: LESTA_OUTCOME_RECORDER, optional: true }],
      useFactory: (config: AppConfigService, redis: Redis, recorder?: LestaOutcomeRecorder): LestaClients =>
        createLestaClients({
          applicationId: config.get('LESTA_APPLICATION_ID'),
          redis,
          budget: { requestsPerSecond: config.get('LESTA_RPS'), reserve: LESTA.tierAReserve },
          fetch: recorder ? meteredFetch({ fetch: globalThis.fetch, record: (outcome) => recorder.recordLesta({ outcome }) }) : undefined
        })
    },
    { provide: LESTA_CLIENT, inject: [LESTA_CLIENTS], useFactory: (clients: LestaClients) => clients.priority }
  ],
  exports: [LESTA_CLIENT, LESTA_CLIENTS]
})
export class LestaModule {}
