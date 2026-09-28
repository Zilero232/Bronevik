import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { LestaClients, LestaOutcomeRecorder } from './lesta.types';

import { AppConfigService, isLestaMock, LESTA, lestaMockBaseUrl } from '../../config';
import { REDIS } from '../redis';
import { LESTA_CLIENT, LESTA_CLIENTS, LESTA_OUTCOME_RECORDER } from './lesta.constants';
import { createLestaClients } from './lesta.factory';

@Global()
@Module({
  providers: [
    {
      provide: LESTA_CLIENTS,
      inject: [AppConfigService, REDIS, { token: LESTA_OUTCOME_RECORDER, optional: true }],
      useFactory: (config: AppConfigService, redis: Redis, recorder?: LestaOutcomeRecorder): LestaClients =>
        createLestaClients({
          applicationId: config.get('LESTA_APPLICATION_ID'),
          baseUrl: isLestaMock({ LESTA_MOCK: config.get('LESTA_MOCK') }) ? lestaMockBaseUrl(config.get('API_URL')) : undefined,
          redis,
          budget: { requestsPerSecond: config.get('LESTA_RPS'), reserve: LESTA.tierAReserve, egress: config.get('LESTA_EGRESS_IP') || undefined },
          onOutcome: recorder ? (outcome) => recorder.recordLesta({ outcome }) : undefined
        })
    },
    { provide: LESTA_CLIENT, inject: [LESTA_CLIENTS], useFactory: (clients: LestaClients) => clients.priority }
  ],
  exports: [LESTA_CLIENT, LESTA_CLIENTS]
})
export class LestaModule {}
