import { Module } from '@nestjs/common';

import { TanksModule } from '../tanks';
import { BuildsController } from './builds.controller';
import { BuildDataService, BuildOptionsService, LoadoutService, PopularBuildsService } from './services';

@Module({
  imports: [TanksModule],
  controllers: [BuildsController],
  providers: [BuildDataService, BuildOptionsService, LoadoutService, PopularBuildsService]
})
export class BuildsModule {}
