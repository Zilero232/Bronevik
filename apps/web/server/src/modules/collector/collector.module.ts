import type { DynamicModule } from '@nestjs/common';

import { Module } from '@nestjs/common';

import type { CollectorModuleOptions } from './collector.types';

import { AggregatesModule } from './aggregates';
import { ClansModule } from './clans';
import { MetricsModule } from './metrics';
import { MonitoringModule } from './monitoring';
import { NewsModule } from './news';
import { PurgeModule } from './purge';
import { CollectorQueuesModule } from './queues';
import { ReferenceModule } from './reference';
import { SchedulesModule } from './schedules';
import { TrackingModule } from './tracking';

@Module({})
export class CollectorModule {
  static register({ hasLesta }: CollectorModuleOptions): DynamicModule {
    return {
      module: CollectorModule,
      imports: [
        CollectorQueuesModule,
        MetricsModule,
        SchedulesModule,
        MonitoringModule,
        AggregatesModule,
        NewsModule,
        PurgeModule,
        ReferenceModule,
        ...(hasLesta ? [TrackingModule, ClansModule] : [])
      ]
    };
  }
}
