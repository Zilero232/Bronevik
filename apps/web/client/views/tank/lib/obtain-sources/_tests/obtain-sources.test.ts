import type { VehicleSource, VehicleSourceMission } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { obtainEditorial, obtainMission } from '../obtain-sources';

const MISSION: VehicleSourceMission = {
  campaignId: 2,
  operationId: 5,
  campaignName: 'Campaign',
  operationName: 'Operation',
  isCampaignReward: false
};

const EVENT = {
  slug: 'summer',
  title: 'Summer event',
  url: 'https://tanki.su/news/summer',
  startsAt: '2026-06-01T00:00:00.000Z',
  endsAt: '2026-06-20T00:00:00.000Z'
};

const SOURCE: VehicleSource = {
  id: '00000000-0000-4000-8000-000000000001',
  kind: 'event',
  title: null,
  url: null,
  note: null,
  startsAt: null,
  endsAt: null,
  event: null,
  mission: null
};

describe('obtainMission', () => {
  it('links the operation page and keeps campaign and operation rewards apart', () => {
    const operation = obtainMission(MISSION);
    const campaign = obtainMission({ ...MISSION, isCampaignReward: true });

    expect(operation.href).toBe(ROUTES.missions.operation({ campaign: MISSION.campaignId, operation: MISSION.operationId }));
    expect(operation.key).not.toBe(campaign.key);
    expect(campaign.isCampaignReward).toBe(true);
  });
});

describe('obtainEditorial', () => {
  it('falls back to the linked event for title, link and dates without repeating it', () => {
    const view = obtainEditorial({ ...SOURCE, event: EVENT });

    expect(view.title).toBe(EVENT.title);
    expect(view.href).toBe(EVENT.url);
    expect(view.startsAt).toBe(EVENT.startsAt);
    expect(view.endsAt).toBe(EVENT.endsAt);
    expect(view.event).toBeNull();
  });

  it('keeps its own title and dates and names the linked event separately', () => {
    const own = { title: 'Own title', startsAt: '2026-06-05T00:00:00.000Z', endsAt: '2026-06-10T00:00:00.000Z' };
    const view = obtainEditorial({ ...SOURCE, ...own, event: EVENT });

    expect(view.title).toBe(own.title);
    expect(view.startsAt).toBe(own.startsAt);
    expect(view.endsAt).toBe(own.endsAt);
    expect(view.event?.title).toBe(EVENT.title);
  });

  it('drops unsafe links and links a personal-mission operation', () => {
    const view = obtainEditorial({ ...SOURCE, url: 'javascript:alert(1)', mission: { campaignId: 1, operationId: 3 } });

    expect(view.href).toBeUndefined();
    expect(view.missionHref).toBe(ROUTES.missions.operation({ campaign: 1, operation: 3 }));
  });
});
