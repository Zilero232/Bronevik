import { Module } from '@nestjs/common';

import { SearchController } from './search.controller';
import { LocalSearchService, PlayerDiscoveryService, SearchService } from './services';

@Module({
  controllers: [SearchController],
  providers: [LocalSearchService, PlayerDiscoveryService, SearchService]
})
export class SearchModule {}
