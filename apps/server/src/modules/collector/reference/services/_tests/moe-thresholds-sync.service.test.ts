import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../../core';

import { FEATURES } from '../../../../../config';
import { MoeThresholdsSyncService } from '../moe-thresholds-sync.service';

describe('MoeThresholdsSyncService.sync', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.runIf(!FEATURES.moePoliroid)('does nothing while the poliroid source is switched off', async () => {
    const prisma = mockDeep<PrismaService>();
    const fetch = vi.fn<(input: string | Request | URL) => Promise<Response>>();

    vi.stubGlobal('fetch', fetch);

    expect(await new MoeThresholdsSyncService(prisma).sync()).toEqual({ skipped: true });
    expect(fetch).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
