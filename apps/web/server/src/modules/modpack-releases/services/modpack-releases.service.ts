import type {
  ModpackChangelog,
  ModpackLatestRelease,
  ModpackManagerUpdate,
  ModpackManagerUpdateQuery,
  ModpackReleasesStatus
} from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import { modpackChangelog, releaseStatus, selectManagerUpdate, selectRelease } from '../lib';
import { DownloadFilesService } from './download-files.service';
import { ReleaseIndexService } from './release-index.service';

@Injectable()
export class ModpackReleasesService {
  constructor(
    private readonly index: ReleaseIndexService,
    private readonly files: DownloadFilesService
  ) {}

  async latest(game: string): Promise<ModpackLatestRelease> {
    return selectRelease({ index: await this.index.load(), game });
  }

  async status(): Promise<ModpackReleasesStatus> {
    const [index, sizes] = await Promise.all([this.index.load(), this.files.sizes()]);

    return releaseStatus({ index, sizes });
  }

  async changelog(limit: number): Promise<ModpackChangelog> {
    return modpackChangelog({ index: await this.index.load(), limit });
  }

  async managerUpdate(query: ModpackManagerUpdateQuery): Promise<ModpackManagerUpdate | null> {
    return selectManagerUpdate({ index: await this.index.load(), query });
  }
}
