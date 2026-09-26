import type { GameEvent, MissionCampaign, MissionOperation, VehicleSource } from '../../../../../generated';

export type RewardMissionsInput = {
  tankId: number;
  campaigns: readonly Pick<MissionCampaign, 'campaignId' | 'name' | 'rewardTankId'>[];
  operations: readonly Pick<MissionOperation, 'campaignId' | 'name' | 'operationId' | 'rewardTankId'>[];
};

export type VehicleSourceRow = VehicleSource & {
  event: Pick<GameEvent, 'endsAt' | 'slug' | 'startsAt' | 'title' | 'url'> | null;
};
