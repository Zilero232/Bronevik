import { Global, Module } from '@nestjs/common';

import { LESTA_OUTCOME_RECORDER } from '../../../core';
import { CircuitBreakerService } from './circuit-breaker.service';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  providers: [CircuitBreakerService, MetricsService, { provide: LESTA_OUTCOME_RECORDER, useExisting: MetricsService }],
  exports: [CircuitBreakerService, MetricsService, LESTA_OUTCOME_RECORDER]
})
export class MetricsModule {}
