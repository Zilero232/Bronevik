import { Module } from '@nestjs/common';

import { HttpModule } from '../../core';
import { ModpackReleasesController } from './modpack-releases.controller';
import { ModpackReleasesService, ReleaseIndexService } from './services';

@Module({
  imports: [HttpModule],
  controllers: [ModpackReleasesController],
  providers: [ReleaseIndexService, ModpackReleasesService]
})
export class ModpackReleasesModule {}
