import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule, validateEnv } from './config';
import { AppLoggerModule, LestaModule, LOGGER, PrismaModule, QueuesModule, RedisModule } from './core';
import { AchievementsRarityWorkerModule } from './modules/achievements-rarity';
import { BillingWorkerModule } from './modules/billing';
import { ClanWorkspaceWorkerModule } from './modules/clan-workspace';
import { CollectorModule } from './modules/collector';
import { CommunityMaintenanceWorkerModule } from './modules/community-maintenance';
import { CompetitionsWorkerModule } from './modules/competitions';
import { DeveloperEventsModule, DeveloperWorkerModule } from './modules/developer';
import { DiscordWorkerModule } from './modules/discord';
import { EventsWorkerModule } from './modules/events';
import { HonestRngWorkerModule } from './modules/honest-rng';
import { MapStatsWorkerModule } from './modules/map-stats';
import { NotificationsWorkerModule } from './modules/notifications';
import { ProgressionWorkerModule } from './modules/progression';
import { PulseWorkerModule } from './modules/pulse';
import { ReplaysWorkerModule } from './modules/replays';
import { ShopWorkerModule } from './modules/shop';
import { SocialWorkerModule } from './modules/social';
import { StreamersWorkerModule } from './modules/streamers';
import { SupertestWorkerModule } from './modules/supertest';
import { WatchlistWorkerModule } from './modules/watchlist';

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
    DiscordWorkerModule,
    SocialWorkerModule,
    WatchlistWorkerModule,
    CompetitionsWorkerModule,
    ProgressionWorkerModule,
    PulseWorkerModule,
    HonestRngWorkerModule,
    MapStatsWorkerModule,
    AchievementsRarityWorkerModule,
    SupertestWorkerModule
  ]
})
export class WorkerModule {}
