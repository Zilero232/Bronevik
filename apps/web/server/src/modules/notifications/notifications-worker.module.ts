import { Module } from '@nestjs/common';

import { AnalyticsCoreModule } from '../analytics';
import { HostLookupService } from '../developer';
import { ReferenceCoreModule } from '../reference';
import { TelegramCoreModule } from '../telegram';
import { NotificationsProducerModule } from './notifications-producer.module';
import { DeliverProcessor, NotificationEventsProcessor, NotificationSchedulesService } from './processors';
import { plusCheckoutProvider } from './providers';
import {
  DeliveryService,
  EmailService,
  FirstWinRemindersService,
  MailTransportService,
  MarksWatchService,
  PlusLaunchService,
  SessionReportsService,
  ThresholdDropsService,
  WebPushSenderService,
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
    WebPushSenderService,
    MailTransportService,
    HostLookupService,
    MarksWatchService,
    SessionReportsService,
    ThresholdDropsService,
    WeeklyDigestService,
    PlusLaunchService,
    plusCheckoutProvider,
    DeliverProcessor,
    NotificationEventsProcessor,
    NotificationSchedulesService
  ],
  exports: [NotificationsProducerModule]
})
export class NotificationsWorkerModule {}
