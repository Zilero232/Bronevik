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
  private refreshing: Promise<ModpackReleaseIndex> | null = null;
  private retryAt = 0;

  constructor(
    private readonly config: AppConfigService,
    private readonly http: HttpClientService
  ) {}

  async load(): Promise<ModpackReleaseIndex> {
    const now = Date.now();

    if (!this.cached) {
      return this.refresh();
    }

    const stale = now - this.cached.loadedAt >= MODPACK_RELEASES_SOURCE.cacheTtlMs;

    if (stale && now >= this.retryAt) {
      this.refresh().catch(() => undefined);
    }

    return this.cached.index;
  }

  private refresh(): Promise<ModpackReleaseIndex> {
    this.refreshing ??= this.fetchIndex().finally(() => {
      this.refreshing = null;
    });

    return this.refreshing;
  }

  private async fetchIndex(): Promise<ModpackReleaseIndex> {
    try {
      const index = modpackReleaseIndexSchema.parse(await this.read());

      this.cached = { index, loadedAt: Date.now() };

      return index;
    } catch (error) {
      this.retryAt = Date.now() + MODPACK_RELEASES_SOURCE.retryDelayMs;
      this.logger.warn(`Release index refresh failed${this.cached ? ', serving the cached one' : ''}: ${String(error)}`);

      throw error;
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
