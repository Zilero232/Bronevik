import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { StreamerSettings } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { StreamerProfileService } from '../streamer-profile.service';

import { StreamerSettingsService } from '../streamer-settings.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new StreamerSettingsService(prisma, mock<StreamerProfileService>()), prisma };
};

const stored = (data: unknown): StreamerSettings => ({
  profileId: 'p1',
  data: data as StreamerSettings['data'],
  updatedAt: new Date('2026-09-01T00:00:00Z')
});

describe('StreamerSettingsService.save', () => {
  it('stamps changed groups with the new source and keeps provenance of unchanged ones', async () => {
    const { service, prisma } = createService();
    const oldCamera = { fov: 95, source: 'editorial', sourceUrl: 'https://nidin.ru/game-settings', checkedAt: '2026-08-01T00:00:00.000Z' };

    prisma.streamerSettings.findUnique.mockResolvedValue(stored({ camera: oldCamera }));

    await service.save({ profileId: 'p1', userId: 'u1', source: 'creator', values: { camera: { fov: 95 }, zoom: { steps: ['x2', 'x16'] } } });

    const [call] = prisma.streamerSettingsVersion.create.mock.calls;
    const data = call?.[0].data.data as Record<string, Record<string, unknown>>;

    expect(data.camera).toEqual(oldCamera);
    expect(data.zoom).toMatchObject({ steps: ['x2', 'x16'], source: 'creator', sourceUrl: null });
    expect(call?.[0].data.changedGroups).toEqual(['zoom']);
  });

  it('writes nothing when no group changed', async () => {
    const { service, prisma } = createService();

    prisma.streamerSettings.findUnique.mockResolvedValue(
      stored({ camera: { fov: 90, source: 'creator', sourceUrl: null, checkedAt: '2026-08-01T00:00:00.000Z' } })
    );

    await service.save({ profileId: 'p1', userId: 'u1', source: 'creator', values: { camera: { fov: 90 } } });

    expect(prisma.streamerSettingsVersion.create).not.toHaveBeenCalled();
  });
});
