import type { VehicleSource, VehicleSourceMission } from '@otmetki/schemas';

import { ROUTES } from '@/shared/constants';
import { safeWebHref } from '@/shared/lib';

import type { ObtainEditorial, ObtainMission } from './obtain-sources.types';

export const obtainMission = ({ campaignId, operationId, campaignName, operationName, isCampaignReward }: VehicleSourceMission): ObtainMission => ({
  key: `${campaignId}-${operationId}-${isCampaignReward ? 'campaign' : 'operation'}`,
  href: ROUTES.missions.operation({ campaign: campaignId, operation: operationId }),
  campaign: campaignName,
  operation: operationName,
  isCampaignReward
});

export const obtainEditorial = ({ id, kind, title, url, note, startsAt, endsAt, event, mission }: VehicleSource): ObtainEditorial => ({
  key: id,
  kind,
  title: title ?? event?.title ?? null,
  href: safeWebHref(url ?? event?.url ?? null),
  missionHref: mission ? ROUTES.missions.operation({ campaign: mission.campaignId, operation: mission.operationId }) : undefined,
  note,
  startsAt: startsAt ?? event?.startsAt ?? null,
  endsAt: endsAt ?? event?.endsAt ?? null,
  event: event && title !== null && event.title !== title ? { title: event.title, href: safeWebHref(event.url) } : null
});
