import type { ModpackLatestRelease, ModpackManagerUpdate, ModpackManagerUpdateQuery } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import { selectManagerUpdate, selectRelease } from '../lib';
import { ReleaseIndexService } from './release-index.service';

@Injectable()
export class ModpackReleasesService {
  constructor(private readonly index: ReleaseIndexService) {}

  async latest(game: string): Promise<ModpackLatestRelease> {
    return selectRelease({ index: await this.index.load(), game });
  }

  async managerUpdate(query: ModpackManagerUpdateQuery): Promise<ModpackManagerUpdate | null> {
    return selectManagerUpdate({ index: await this.index.load(), query });
  }
}
