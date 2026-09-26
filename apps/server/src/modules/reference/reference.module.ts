import { Module } from '@nestjs/common';

import { ReferenceCoreModule } from './reference-core.module';
import { ReferenceController } from './reference.controller';
import { GameVersionService, ServersOnlineService } from './services';

@Module({
  imports: [ReferenceCoreModule],
  controllers: [ReferenceController],
  providers: [GameVersionService, ServersOnlineService]
})
export class ReferenceModule {}
