import { createKeyvNonBlocking } from '@keyv/redis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { CACHE_STORE, THROTTLE } from './common/cache';
import { AllExceptionsFilter } from './common/filters';
import { OriginGuard } from './common/guards';
import { AppConfigModule, AppConfigService } from './config';
import { AppLoggerModule, LestaModule, LOGGER, PrismaModule, QueuesModule, REDIS, RedisModule } from './core';
import { AchievementsRarityModule } from './modules/achievements-rarity';
import { AnalyticsModule } from './modules/analytics';
import { AuthModule } from './modules/auth';
import { BestBattlesModule } from './modules/best-battles';
import { BillingModule } from './modules/billing';
import { BuildsModule } from './modules/builds';
import { ClanWorkspaceModule } from './modules/clan-workspace';
import { ClansModule } from './modules/clans';
import { CoachingModule } from './modules/coaching';
import { BoardModule, CollectorProducerModule, CollectorQueuesModule } from './modules/collector';
import { CommunityBuildsModule } from './modules/community-builds';
import { CompareModule } from './modules/compare';
import { CompetitionsModule } from './modules/competitions';
import { DeveloperEventsModule, DeveloperModule } from './modules/developer';
import { DiscordModule } from './modules/discord';
import { EventsModule } from './modules/events';
import { GuidesModule } from './modules/guides';
import { HealthModule } from './modules/health';
import { HonestRngModule } from './modules/honest-rng';
import { LeaderboardsModule } from './modules/leaderboards';
import { MapStatsModule } from './modules/map-stats';
import { MapsModule } from './modules/maps';
import { MarksModule } from './modules/marks';
import { MeModule } from './modules/me';
import { MissionsModule } from './modules/missions';
import { ModModule } from './modules/mod';
import { ModerationModule } from './modules/moderation';
import { ModesModule } from './modules/modes';
import { ModpackReleasesModule } from './modules/modpack-releases';
import { NotificationsModule } from './modules/notifications';
import { PlatoonsModule } from './modules/platoons';
import { PlayersModule } from './modules/players';
import { ProgressionModule } from './modules/progression';
import { PublicApiModule } from './modules/public-api';
import { PulseModule } from './modules/pulse';
import { RecruitingModule } from './modules/recruiting';
import { ReferenceModule } from './modules/reference';
import { ReplaysModule } from './modules/replays';
import { SearchModule } from './modules/search';
import { ShopModule } from './modules/shop';
import { SocialModule } from './modules/social';
import { StreamerEventsModule, StreamersModule } from './modules/streamers';
import { SupertestModule } from './modules/supertest';
import { TacticsModule } from './modules/tactics';
import { TankMathModule } from './modules/tank-math';
import { TanksModule } from './modules/tanks';
import { TelegramModule } from './modules/telegram';
import { TournamentsModule } from './modules/tournaments';
import { TreeModule } from './modules/tree';
import { VkModule } from './modules/vk';
import { WatchlistModule } from './modules/watchlist';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule.forService(LOGGER.service.server),
    PrismaModule.forRoot(),
    RedisModule,
    LestaModule,
    QueuesModule,
    CollectorQueuesModule,
    CollectorProducerModule,
    DeveloperEventsModule,
    StreamerEventsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        stores: [createKeyvNonBlocking(config.get('REDIS_URL'), { namespace: CACHE_STORE.namespace })]
      })
    }),
    ThrottlerModule.forRootAsync({
      inject: [REDIS],
      useFactory: (redis: Redis) => ({
        throttlers: [{ name: THROTTLE.name, ttl: THROTTLE.ttl, limit: THROTTLE.limit }],
        storage: new ThrottlerStorageRedisService(redis)
      })
    }),
    ReferenceModule,
    AuthModule,
    HealthModule,
    SearchModule,
    PlayersModule,
    TanksModule,
    BuildsModule,
    TreeModule,
    MapsModule,
    MarksModule,
    LeaderboardsModule,
    ClansModule,
    CompareModule,
    AnalyticsModule,
    MeModule,
    ModModule,
    ModpackReleasesModule,
    DeveloperModule,
    PublicApiModule,
    NotificationsModule,
    TelegramModule,
    DiscordModule,
    VkModule,
    BillingModule,
    StreamersModule,
    ReplaysModule,
    CommunityBuildsModule,
    GuidesModule,
    PlatoonsModule,
    RecruitingModule,
    CoachingModule,
    TournamentsModule,
    ModerationModule,
    TacticsModule,
    ShopModule,
    EventsModule,
    MissionsModule,
    ModesModule,
    WatchlistModule,
    CompetitionsModule,
    ClanWorkspaceModule,
    SocialModule,
    ProgressionModule,
    PulseModule,
    BestBattlesModule,
    HonestRngModule,
    MapStatsModule,
    TankMathModule,
    AchievementsRarityModule,
    SupertestModule,
    BoardModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: OriginGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor }
  ]
})
export class AppModule {}
