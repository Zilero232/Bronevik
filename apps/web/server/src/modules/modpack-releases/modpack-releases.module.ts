import { Module } from '@nestjs/common';

import { ModpackReleasesController } from './modpack-releases.controller';
import { releaseIndexPathProvider } from './providers';
import { ModpackReleasesService, ReleaseIndexService } from './services';

@Module({
  controllers: [ModpackReleasesController],
  providers: [releaseIndexPathProvider, ReleaseIndexService, ModpackReleasesService]
})
export class ModpackReleasesModule {}
