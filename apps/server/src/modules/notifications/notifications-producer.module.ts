import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NOTIFICATIONS_QUEUE } from './contracts';
import { NotificationService } from './services/notification.service';

const queues = BullModule.registerQueue({ name: NOTIFICATIONS_QUEUE.deliver }, { name: NOTIFICATIONS_QUEUE.events });

@Module({
  imports: [queues],
  providers: [NotificationService],
  exports: [queues, NotificationService]
})
export class NotificationsProducerModule {}
