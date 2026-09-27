import { afterEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../../config';
import type { HttpClientService } from '../../../../core';

import { MODPACK_RELEASES_SOURCE } from '../../config';
import { INDEX } from '../../lib/select-release/_tests/fixtures';
import { ReleaseIndexService } from '../release-index.service';

const REMOTE = 'https://cdn.triotmetki.ru/modpack/releases.json';

const createService = (url: string) => {
  const config = mock<AppConfigService>();
  const http = mock<HttpClientService>();

  config.get.calledWith('MODPACK_RELEASES_URL').mockReturnValue(url);

  return { service: new ReleaseIndexService(config, http), http };
};

describe('ReleaseIndexService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reads and validates the committed index without a remote url', async () => {
    const { service, http } = createService('');
    const index = await service.load();

    expect(index.schemaVersion).toBe(1);
    expect(http.getJson).not.toHaveBeenCalled();
  });

  it('reads the remote index when one is configured and caches it', async () => {
    const { service, http } = createService(REMOTE);

    http.getJson.mockResolvedValue(INDEX);

    await service.load();
    await service.load();

    expect(http.getJson).toHaveBeenCalledTimes(1);
    expect(http.getJson.mock.calls[0]?.[0].url).toBe(REMOTE);
  });

  it('serves the cached index when a refresh fails', async () => {
    vi.useFakeTimers();

    const { service, http } = createService(REMOTE);

    http.getJson.mockResolvedValueOnce(INDEX).mockRejectedValueOnce(new Error('offline'));
    await service.load();
    vi.advanceTimersByTime(MODPACK_RELEASES_SOURCE.cacheTtlMs + 1);

    await expect(service.load()).resolves.toEqual(INDEX);
    expect(http.getJson).toHaveBeenCalledTimes(2);
  });

  it('refuses a malformed index when nothing is cached', async () => {
    const { service, http } = createService(REMOTE);

    http.getJson.mockResolvedValue({ schemaVersion: 1, releases: [{ version: 'latest' }] });

    await expect(service.load()).rejects.toThrow();
  });
});
