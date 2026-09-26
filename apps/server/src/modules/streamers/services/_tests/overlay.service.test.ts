import { overlayConfigSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../../../billing';
import type { OverlayDataService } from '../overlay-data.service';

import { AppForbiddenException } from '../../../../common/exceptions';
import { OverlayService } from '../overlay.service';

const config = overlayConfigSchema.parse({ metrics: ['wn8'] });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const data = mock<OverlayDataService>();

  return { service: new OverlayService(prisma, mock<AppConfigService>(), mock<EntitlementsService>(), data), prisma, data };
};

describe('OverlayService.preview', () => {
  it('refuses to preview the stats of an account the streamer has not linked', async () => {
    const { service, prisma, data } = createService();

    prisma.userLestaAccount.count.mockResolvedValue(0);

    await expect(service.preview({ userId: 'u1', accountId: 7, kind: 'wn8', config })).rejects.toBeInstanceOf(AppForbiddenException);
    expect(data.preview).not.toHaveBeenCalled();
  });
});
