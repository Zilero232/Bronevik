import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule, validateEnv } from './config';
import { AppLoggerModule, LestaModule, LOGGER, PrismaModule, QueuesModule, RedisModule } from './core';
import { AchievementsRarityWorkerModule } from './modules/achievements-rarity';
import { BillingWorkerModule } from './modules/billing';
import { ClanWorkspaceWorkerModule } from './modules/clan-workspace';
import { CollectorModule, WORKER_DATABASE } from './modules/collector';
import { CommunityMaintenanceWorkerModule } from './modules/community-maintenance';
import { CompetitionsWorkerModule } from './modules/competitions';
import { DeveloperEventsModule, DeveloperWorkerModule } from './modules/developer';
import { DiscordWorkerModule } from './modules/discord';
import { EventsWorkerModule } from './modules/events';
import { HonestRngWorkerModule } from './modules/honest-rng';
import { LestaLinksWorkerModule } from './modules/lesta-links';
import { MapStatsWorkerModule } from './modules/map-stats';
import { NotificationsWorkerModule } from './modules/notifications';
import { ProgressionWorkerModule } from './modules/progression';
import { PulseWorkerModule } from './modules/pulse';
import { ReplaysWorkerModule } from './modules/replays';
import { SessionShareEventsModule, SessionShareWorkerModule } from './modules/session-share';
import { ShopWorkerModule } from './modules/shop';
import { SocialWorkerModule } from './modules/social';
import { StreamersWorkerModule } from './modules/streamers';
import { SupertestWorkerModule } from './modules/supertest';
import { WatchlistWorkerModule } from './modules/watchlist';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule.forService(LOGGER.service.worker),
    ScheduleModule.forRoot(),
    PrismaModule.forRoot({ poolMax: WORKER_DATABASE.poolMax }),
    RedisModule,
    QueuesModule,
    LestaModule,
    DeveloperEventsModule,
    SessionShareEventsModule,
    CollectorModule.register({ hasLesta: validateEnv(process.env).LESTA_APPLICATION_ID !== '' }),
    DeveloperWorkerModule,
    NotificationsWorkerModule,
    SessionShareWorkerModule,
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
    SupertestWorkerModule,
    LestaLinksWorkerModule
  ]
})
export class WorkerModule {}
