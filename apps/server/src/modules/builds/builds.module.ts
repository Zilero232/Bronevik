import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { TanksModule } from '../tanks';
import { BuildsCatalogController } from './builds-catalog.controller';
import { BuildsController } from './builds.controller';
import {
  BuildDataService,
  BuildOptionsService,
  BuildsCatalogService,
  BuildUsageService,
  LoadoutService,
  PopularBuildsService,
  RecommendedBuildService
} from './services';

@Module({
  imports: [TanksModule, BillingCoreModule],
  controllers: [BuildsController, BuildsCatalogController],
  providers: [
    BuildDataService,
    BuildOptionsService,
    LoadoutService,
    PopularBuildsService,
    BuildUsageService,
    RecommendedBuildService,
    BuildsCatalogService
  ]
})
export class BuildsModule {}
