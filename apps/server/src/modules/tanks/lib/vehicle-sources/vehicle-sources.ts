import type { VehicleSource, VehicleSourceMission } from '@otmetki/schemas';

import type { RewardMissionsInput, VehicleSourceRow } from './vehicle-sources.types';

import { toIso } from '../../../../common/lib';

export const rewardMissions = ({ tankId, campaigns, operations }: RewardMissionsInput): VehicleSourceMission[] => {
  const campaignName = (campaignId: number) => campaigns.find((campaign) => campaign.campaignId === campaignId)?.name ?? null;

  const byOperation = operations
    .filter((operation) => operation.rewardTankId === tankId)
    .map((operation) => ({
      campaignId: operation.campaignId,
      operationId: operation.operationId,
      campaignName: campaignName(operation.campaignId),
      operationName: operation.name,
      isCampaignReward: false
    }));

  const byCampaign = campaigns
    .filter((campaign) => campaign.rewardTankId === tankId)
    .flatMap((campaign) => {
      const last = operations.filter((operation) => operation.campaignId === campaign.campaignId).at(-1);

      return last && !byOperation.some((entry) => entry.campaignId === campaign.campaignId)
        ? [
            {
              campaignId: campaign.campaignId,
              operationId: last.operationId,
              campaignName: campaign.name,
              operationName: last.name,
              isCampaignReward: true
            }
          ]
        : [];
    });

  return [...byOperation, ...byCampaign];
};

export const toVehicleSourceView = (row: VehicleSourceRow): VehicleSource => ({
  id: row.id,
  kind: row.kind,
  title: row.title,
  url: row.url && URL.canParse(row.url) ? row.url : null,
  note: row.note,
  startsAt: toIso(row.startsAt),
  endsAt: toIso(row.endsAt),
  event: row.event
    ? {
        slug: row.event.slug,
        title: row.event.title,
        url: row.event.url,
        startsAt: row.event.startsAt.toISOString(),
        endsAt: toIso(row.event.endsAt)
      }
    : null,
  mission:
    row.missionCampaignId !== null && row.missionOperationId !== null
      ? { campaignId: row.missionCampaignId, operationId: row.missionOperationId }
      : null
});
