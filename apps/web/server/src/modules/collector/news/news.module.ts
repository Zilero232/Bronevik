import { Module } from '@nestjs/common';

import { HttpModule } from '../../../core';
import { NewsProcessor } from './processors';
import { NewsSyncService } from './services';

@Module({
  imports: [HttpModule],
  providers: [NewsSyncService, NewsProcessor]
})
export class NewsModule {}
