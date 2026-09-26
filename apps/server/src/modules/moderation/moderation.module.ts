import { Module } from '@nestjs/common';

import { ModerationController } from './moderation.controller';
import { ModerationService } from './services';

@Module({
  controllers: [ModerationController],
  providers: [ModerationService]
})
export class ModerationModule {}
