import { Module } from '@nestjs/common';

import { AnalyticsCoreModule } from '../analytics';
import { ReferenceCoreModule } from '../reference';
import { TelegramCoreModule } from '../telegram';
import { NotificationsProducerModule } from './notifications-producer.module';
import { DeliverProcessor, NotificationEventsProcessor, NotificationSchedulesService } from './processors';
import {
  DeliveryService,
  EmailService,
  FirstWinRemindersService,
  MarksWatchService,
  PlusLaunchService,
  SessionReportsService,
  ThresholdDropsService,
  WebPushService,
  WeeklyDigestService
} from './services';

@Module({
  imports: [NotificationsProducerModule, TelegramCoreModule, ReferenceCoreModule, AnalyticsCoreModule],
  providers: [
    DeliveryService,
    EmailService,
    FirstWinRemindersService,
    WebPushService,
    MarksWatchService,
    SessionReportsService,
    ThresholdDropsService,
    WeeklyDigestService,
    PlusLaunchService,
    DeliverProcessor,
    NotificationEventsProcessor,
    NotificationSchedulesService
  ],
  exports: [NotificationsProducerModule]
})
export class NotificationsWorkerModule {}
