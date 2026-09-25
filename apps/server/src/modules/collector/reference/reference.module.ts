import { Module } from '@nestjs/common';

import { ReferenceProcessor } from './processors/reference.processor';
import { EncyclopediaSyncService, ExpectedValuesSyncService, MasteryThresholdsSyncService, MoeThresholdsSyncService } from './services';

@Module({
  providers: [EncyclopediaSyncService, ExpectedValuesSyncService, MoeThresholdsSyncService, MasteryThresholdsSyncService, ReferenceProcessor]
})
export class ReferenceModule {}
