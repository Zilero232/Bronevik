import { Module } from '@nestjs/common';

import { ReferenceModule } from '../reference';
import { TelegramCoreModule } from '../telegram';
import { NotificationsProducerModule } from './notifications-producer.module';
import { DeliverProcessor, NotificationEventsProcessor, NotificationSchedulesService } from './processors';
import {
  DeliveryService,
  EmailService,
  MarksWatchService,
  SessionReportsService,
  ThresholdDropsService,
  WebPushService,
  WeeklyDigestService
} from './services';

@Module({
  imports: [NotificationsProducerModule, TelegramCoreModule, ReferenceModule],
  providers: [
    DeliveryService,
    EmailService,
    WebPushService,
    MarksWatchService,
    SessionReportsService,
    ThresholdDropsService,
    WeeklyDigestService,
    DeliverProcessor,
    NotificationEventsProcessor,
    NotificationSchedulesService
  ],
  exports: [NotificationsProducerModule]
})
export class NotificationsWorkerModule {}
