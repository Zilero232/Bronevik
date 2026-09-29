import type { ModpackReleaseIndex } from '@otmetki/schemas';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { modpackReleaseIndexSchema } from '@otmetki/schemas';
import { readFile } from 'node:fs/promises';

import type { CachedReleaseIndex } from './release-index.types';

import { MODPACK_RELEASES_SOURCE, MODPACK_RELEASES_TOKENS } from '../config';

@Injectable()
export class ReleaseIndexService {
  private readonly logger = new Logger(ReleaseIndexService.name);
  private cached: CachedReleaseIndex | null = null;
  private refreshing: Promise<ModpackReleaseIndex> | null = null;
  private retryAt = 0;

  constructor(@Inject(MODPACK_RELEASES_TOKENS.indexPath) private readonly indexPath: string) {}

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
    this.refreshing ??= this.readIndex().finally(() => {
      this.refreshing = null;
    });

    return this.refreshing;
  }

  private async readIndex(): Promise<ModpackReleaseIndex> {
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
    const text = await readFile(this.indexPath, 'utf8').catch((error: unknown) => {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return '';
      }

      throw error;
    });

    return text.trim() === '' ? MODPACK_RELEASES_SOURCE.emptyIndex : JSON.parse(text);
  }
}
