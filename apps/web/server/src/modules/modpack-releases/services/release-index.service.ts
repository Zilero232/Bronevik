import type { ModpackReleaseIndex } from '@otmetki/schemas';

import { Injectable, Logger } from '@nestjs/common';
import { modpackReleaseIndexSchema } from '@otmetki/schemas';
import { readFile } from 'node:fs/promises';

import type { CachedReleaseIndex } from './release-index.types';

import { AppConfigService } from '../../../config';
import { HttpClientService } from '../../../core';
import { MODPACK_RELEASES_SOURCE } from '../config';

@Injectable()
export class ReleaseIndexService {
  private readonly logger = new Logger(ReleaseIndexService.name);
  private cached: CachedReleaseIndex | null = null;

  constructor(
    private readonly config: AppConfigService,
    private readonly http: HttpClientService
  ) {}

  async load(): Promise<ModpackReleaseIndex> {
    const now = Date.now();

    if (this.cached && now - this.cached.loadedAt < MODPACK_RELEASES_SOURCE.cacheTtlMs) {
      return this.cached.index;
    }

    try {
      const index = modpackReleaseIndexSchema.parse(await this.read());

      this.cached = { index, loadedAt: now };

      return index;
    } catch (error) {
      if (!this.cached) {
        throw error;
      }

      this.logger.warn(`Release index refresh failed, serving the cached one: ${String(error)}`);

      return this.cached.index;
    }
  }

  private async read(): Promise<unknown> {
    const url = this.config.get('MODPACK_RELEASES_URL');

    if (url) {
      return this.http.getJson({ url, options: { timeout: MODPACK_RELEASES_SOURCE.fetchTimeoutMs } });
    }

    return JSON.parse(await readFile(new URL(MODPACK_RELEASES_SOURCE.asset, import.meta.url), 'utf8'));
  }
}
