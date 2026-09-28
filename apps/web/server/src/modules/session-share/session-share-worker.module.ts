import { Module } from '@nestjs/common';

import { DiscordCoreModule } from '../discord';
import { TelegramCoreModule } from '../telegram';
import { SessionShareProcessor } from './processors';
import { SessionShareDeliveryService } from './services/session-share-delivery.service';
import { SessionShareProducerModule } from './session-share-producer.module';

@Module({
  imports: [SessionShareProducerModule, TelegramCoreModule, DiscordCoreModule],
  providers: [SessionShareDeliveryService, SessionShareProcessor]
})
export class SessionShareWorkerModule {}
