import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { HttpClientService, PrismaService } from '../../../../../core';

import { FEATURES } from '../../../../../config';
import { MoeThresholdsSyncService } from '../moe-thresholds-sync.service';

describe('MoeThresholdsSyncService.sync', () => {
  it.runIf(!FEATURES.moePoliroid)('does nothing while the poliroid source is switched off', async () => {
    const prisma = mockDeep<PrismaService>();
    const http = mock<HttpClientService>();

    expect(await new MoeThresholdsSyncService(prisma, http).sync()).toEqual({ skipped: true });
    expect(http.getJson).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
