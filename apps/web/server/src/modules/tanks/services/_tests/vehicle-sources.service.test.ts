import type { CreateVehicleSourceInput } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { GameEvent, MissionCampaign, MissionOperation, VehicleSource } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { AppNotFoundException } from '../../../../common/exceptions';
import { VehicleSourcesService } from '../vehicle-sources.service';

const sourceRow = (overrides: Partial<VehicleSource> = {}): VehicleSource & { event: null } => ({
  id: 's1',
  tankId: 1,
  kind: 'event',
  title: null,
  url: null,
  note: null,
  eventId: null,
  missionCampaignId: null,
  missionOperationId: null,
  startsAt: null,
  endsAt: null,
  createdByUserId: null,
  createdAt: new Date('2026-09-20T00:00:00Z'),
  event: null,
  ...overrides
});

const campaign = (fields: Pick<MissionCampaign, 'campaignId' | 'name' | 'rewardTankId'>) => mock<MissionCampaign>({ gameVersionId: 5, ...fields });

const operation = (fields: Pick<MissionOperation, 'campaignId' | 'name' | 'operationId' | 'rewardTankId'>) => mock<MissionOperation>(fields);

const input: CreateVehicleSourceInput = { tankId: 1, kind: 'event', title: 'Marathon' };

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.vehicleSource.create.mockResolvedValue(sourceRow());
  prisma.missionCampaign.findFirst.mockResolvedValue(null);

  return { service: new VehicleSourcesService(prisma), prisma };
};

describe('VehicleSourcesService.forTank', () => {
  it('maps the stored sources and drops a link that is not a URL', async () => {
    const { service, prisma } = createService();

    prisma.vehicleSource.findMany.mockResolvedValue([sourceRow({ url: 'not a url' }), sourceRow({ id: 's2', url: 'https://tanki.su/x' })]);

    const sources = await service.forTank(1);

    expect(sources.map((source) => source.url)).toEqual([null, 'https://tanki.su/x']);
  });
});

describe('VehicleSourcesService.missionsFor', () => {
  it('returns nothing before any mission campaign is known', async () => {
    const { service, prisma } = createService();

    await expect(service.missionsFor(1)).resolves.toEqual([]);
    expect(prisma.missionCampaign.findMany).not.toHaveBeenCalled();
  });

  it('lists the operations and campaigns that reward the tank', async () => {
    const { service, prisma } = createService();

    prisma.missionCampaign.findFirst.mockResolvedValue(campaign({ campaignId: 1, name: 'First', rewardTankId: null }));

    prisma.missionCampaign.findMany.mockResolvedValue([
      campaign({ campaignId: 1, name: 'First', rewardTankId: null }),
      campaign({ campaignId: 2, name: 'Second', rewardTankId: 7 })
    ]);

    prisma.missionOperation.findMany.mockResolvedValue([
      operation({ campaignId: 1, operationId: 10, name: 'Op A', rewardTankId: 7 }),
      operation({ campaignId: 2, operationId: 20, name: 'Op B', rewardTankId: null }),
      operation({ campaignId: 2, operationId: 21, name: 'Op C', rewardTankId: null })
    ]);

    const missions = await service.missionsFor(7);

    expect(missions.map((mission) => [mission.operationId, mission.isCampaignReward])).toEqual([
      [10, false],
      [21, true]
    ]);
  });
});

describe('VehicleSourcesService.create', () => {
  it('stores the author and clears optional fields that were not sent', async () => {
    const { service, prisma } = createService();

    await service.create({ userId: 'u1', input });

    expect(prisma.vehicleSource.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdByUserId: 'u1', title: 'Marathon', url: null, eventId: null, startsAt: null, endsAt: null })
      })
    );
  });

  it('links the source to an event found by slug', async () => {
    const { service, prisma } = createService();

    prisma.gameEvent.findUnique.mockResolvedValue(mock<GameEvent>({ id: 'e1' }));

    await service.create({ userId: 'u1', input: { ...input, eventSlug: 'marathon' } });

    expect(prisma.vehicleSource.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ eventId: 'e1' }) }));
  });

  it('refuses an unknown event slug without writing', async () => {
    const { service, prisma } = createService();

    prisma.gameEvent.findUnique.mockResolvedValue(null);

    await expect(service.create({ userId: 'u1', input: { ...input, eventSlug: 'nope' } })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.vehicleSource.create).not.toHaveBeenCalled();
  });

  it('stores the window dates as dates', async () => {
    const { service, prisma } = createService();

    await service.create({ userId: 'u1', input: { ...input, startsAt: '2026-10-01T00:00:00.000Z', endsAt: '2026-10-10T00:00:00.000Z' } });

    expect(prisma.vehicleSource.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ startsAt: new Date('2026-10-01T00:00:00.000Z'), endsAt: new Date('2026-10-10T00:00:00.000Z') })
      })
    );
  });
});

describe('VehicleSourcesService.remove', () => {
  it('deletes an existing source', async () => {
    const { service, prisma } = createService();

    prisma.vehicleSource.deleteMany.mockResolvedValue({ count: 1 });

    await expect(service.remove('s1')).resolves.toBeUndefined();
  });

  it('reports a missing source as not found', async () => {
    const { service, prisma } = createService();

    prisma.vehicleSource.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove('s1')).rejects.toBeInstanceOf(AppNotFoundException);
  });
});
