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
import { AppConfigModule, AppConfigService } from './config';
import { AppLoggerModule, LestaModule, LOGGER, PrismaModule, QueuesModule, REDIS, RedisModule } from './core';
import { AuthModule } from './modules/auth';
import { BillingModule } from './modules/billing';
import { BuildsModule } from './modules/builds';
import { ClanWorkspaceModule } from './modules/clan-workspace';
import { ClansModule } from './modules/clans';
import { CoachingModule } from './modules/coaching';
import { BoardModule, CollectorProducerModule, CollectorQueuesModule } from './modules/collector';
import { CommunityBuildsModule } from './modules/community-builds';
import { CompareModule } from './modules/compare';
import { DeveloperEventsModule, DeveloperModule } from './modules/developer';
import { EventsModule } from './modules/events';
import { GuidesModule } from './modules/guides';
import { HealthModule } from './modules/health';
import { LeaderboardsModule } from './modules/leaderboards';
import { MapsModule } from './modules/maps';
import { MarksModule } from './modules/marks';
import { MeModule } from './modules/me';
import { ModModule } from './modules/mod';
import { ModerationModule } from './modules/moderation';
import { NotificationsModule } from './modules/notifications';
import { PlatoonsModule } from './modules/platoons';
import { PlayersModule } from './modules/players';
import { PublicApiModule } from './modules/public-api';
import { PulseModule } from './modules/pulse';
import { RecruitingModule } from './modules/recruiting';
import { ReferenceModule } from './modules/reference';
import { ReplaysModule } from './modules/replays';
import { SearchModule } from './modules/search';
import { ShopModule } from './modules/shop';
import { SocialModule } from './modules/social';
import { StreamersModule } from './modules/streamers';
import { TacticsModule } from './modules/tactics';
import { TanksModule } from './modules/tanks';
import { TelegramModule } from './modules/telegram';
import { TournamentsModule } from './modules/tournaments';
import { TreeModule } from './modules/tree';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule.forService(LOGGER.service.server),
    PrismaModule,
    RedisModule,
    LestaModule,
    QueuesModule,
    CollectorQueuesModule,
    CollectorProducerModule,
    DeveloperEventsModule,
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
    MeModule,
    ModModule,
    DeveloperModule,
    PublicApiModule,
    NotificationsModule,
    TelegramModule,
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
    ClanWorkspaceModule,
    SocialModule,
    PulseModule,
    BoardModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor }
  ]
})
export class AppModule {}
