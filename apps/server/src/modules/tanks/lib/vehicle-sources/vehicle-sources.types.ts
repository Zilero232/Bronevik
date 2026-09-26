import type { MissionCampaign, MissionOperation } from '../../../../../generated';

export type RewardMissionsInput = {
  tankId: number;
  campaigns: readonly Pick<MissionCampaign, 'campaignId' | 'name' | 'rewardTankId'>[];
  operations: readonly Pick<MissionOperation, 'campaignId' | 'name' | 'operationId' | 'rewardTankId'>[];
};
