import { Module } from '@nestjs/common';

import { ModpackReleasesController } from './modpack-releases.controller';
import { releaseIndexPathProvider } from './providers';
import { DownloadFilesService, ModpackReleasesService, ReleaseIndexService } from './services';

@Module({
  controllers: [ModpackReleasesController],
  providers: [releaseIndexPathProvider, ReleaseIndexService, DownloadFilesService, ModpackReleasesService]
})
export class ModpackReleasesModule {}
