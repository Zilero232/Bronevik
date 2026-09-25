import { Module } from '@nestjs/common';

import { NewsProcessor } from './processors/news.processor';
import { NewsSyncService } from './services';

@Module({
  providers: [NewsSyncService, NewsProcessor]
})
export class NewsModule {}
