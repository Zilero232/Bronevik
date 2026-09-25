import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from './notifications-producer.module';
import { NotificationsController } from './notifications.controller';
import { InboxService, PushSubscriptionsService } from './services';

@Module({
  imports: [NotificationsProducerModule],
  controllers: [NotificationsController],
  providers: [InboxService, PushSubscriptionsService],
  exports: [NotificationsProducerModule]
})
export class NotificationsModule {}
