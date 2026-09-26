import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Prisma, StreamerSettings } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { StreamerProfileService } from '../streamer-profile.service';

import { StreamerSettingsService } from '../streamer-settings.service';

const NOW = new Date('2026-09-26T12:00:00Z');

const ZOOM_SOURCE = 'https://example.com/zoom-settings';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new StreamerSettingsService(prisma, mock<StreamerProfileService>()), prisma };
};

const stored = (data: Prisma.JsonObject): StreamerSettings => ({
  profileId: 'p1',
  data,
  updatedAt: new Date('2026-09-01T00:00:00Z')
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('StreamerSettingsService.save', () => {
  it('stamps changed groups with the new source and keeps provenance of unchanged ones', async () => {
    const { service, prisma } = createService();
    const oldCamera = { fov: 95, source: 'editorial', sourceUrl: 'https://nidin.ru/game-settings', checkedAt: '2026-08-01T00:00:00.000Z' };

    prisma.streamerSettings.findUnique.mockResolvedValue(stored({ camera: oldCamera }));

    await service.save({ profileId: 'p1', userId: 'u1', source: 'creator', values: { camera: { fov: 95 }, zoom: { steps: ['x2', 'x16'] } } });

    const [call] = prisma.streamerSettingsVersion.create.mock.calls;

    expect(call?.[0].data.data).toEqual({
      camera: oldCamera,
      zoom: { steps: ['x2', 'x16'], source: 'creator', sourceUrl: null, checkedAt: NOW.toISOString() }
    });

    expect(call?.[0].data.changedGroups).toEqual(['zoom']);
  });

  it('records where each changed group was taken from', async () => {
    const { service, prisma } = createService();

    prisma.streamerSettings.findUnique.mockResolvedValue(null);

    await service.save({
      profileId: 'p1',
      userId: 'u1',
      source: 'editorial',
      values: { zoom: { steps: ['x2'] } },
      sourceUrls: { zoom: ZOOM_SOURCE }
    });

    expect(prisma.streamerSettingsVersion.create.mock.calls[0]?.[0].data.data).toMatchObject({
      zoom: { source: 'editorial', sourceUrl: ZOOM_SOURCE, checkedAt: NOW.toISOString() }
    });
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
