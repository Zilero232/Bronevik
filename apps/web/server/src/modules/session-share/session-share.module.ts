import { Module } from '@nestjs/common';

import { ModModule } from '../mod';
import { SessionShareService } from './services/session-share.service';
import { SessionShareProducerModule } from './session-share-producer.module';
import { SessionShareController } from './session-share.controller';

@Module({
  imports: [ModModule, SessionShareProducerModule],
  controllers: [SessionShareController],
  providers: [SessionShareService]
})
export class SessionShareModule {}
