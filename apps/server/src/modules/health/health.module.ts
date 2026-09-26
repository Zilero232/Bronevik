import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { CollectorStateIndicator, RedisIndicator } from './indicators';
import { HealthService } from './services';

@Module({
  imports: [TerminusModule.forRoot({ errorLogStyle: 'json' })],
  controllers: [HealthController],
  providers: [HealthService, RedisIndicator, CollectorStateIndicator]
})
export class HealthModule {}
