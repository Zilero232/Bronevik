import type { VehicleSourceMission } from '@otmetki/schemas';

import type { RewardMissionsInput } from './vehicle-sources.types';

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
