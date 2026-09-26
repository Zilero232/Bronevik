import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule, validateEnv } from './config';
import { AppLoggerModule, LestaModule, LOGGER, PrismaModule, QueuesModule, RedisModule } from './core';
import { BillingWorkerModule } from './modules/billing';
import { ClanWorkspaceWorkerModule } from './modules/clan-workspace';
import { CollectorModule } from './modules/collector';
import { CommunityMaintenanceWorkerModule } from './modules/community-maintenance';
import { DeveloperEventsModule, DeveloperWorkerModule } from './modules/developer';
import { EventsWorkerModule } from './modules/events';
import { NotificationsWorkerModule } from './modules/notifications';
import { PulseWorkerModule } from './modules/pulse';
import { ReplaysWorkerModule } from './modules/replays';
import { ShopWorkerModule } from './modules/shop';
import { SocialWorkerModule } from './modules/social';
import { StreamersWorkerModule } from './modules/streamers';

const env = validateEnv(process.env);

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule.forService(LOGGER.service.worker),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    QueuesModule,
    LestaModule,
    DeveloperEventsModule,
    CollectorModule.register({ hasLesta: env.LESTA_APPLICATION_ID !== '' }),
    DeveloperWorkerModule,
    NotificationsWorkerModule,
    BillingWorkerModule,
    StreamersWorkerModule,
    ReplaysWorkerModule,
    ShopWorkerModule,
    EventsWorkerModule,
    CommunityMaintenanceWorkerModule,
    ClanWorkspaceWorkerModule,
    SocialWorkerModule,
    PulseWorkerModule
  ]
})
export class WorkerModule {}
