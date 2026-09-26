import { describe, expect, it } from 'vitest';

import { rewardMissions } from '../vehicle-sources';

const campaigns = [
  { campaignId: 1, name: 'Кампания 1', rewardTankId: null },
  { campaignId: 2, name: 'Кампания 2', rewardTankId: 900 }
];

const operations = [
  { campaignId: 1, operationId: 10, name: 'StuG IV', rewardTankId: 100 },
  { campaignId: 1, operationId: 11, name: 'T28 HTC', rewardTankId: 101 },
  { campaignId: 2, operationId: 20, name: 'Excalibur', rewardTankId: 200 },
  { campaignId: 2, operationId: 21, name: 'Chimera', rewardTankId: 201 }
];

describe('rewardMissions', () => {
  it('links a tank to the operation that awards it', () => {
    expect(rewardMissions({ tankId: 101, campaigns, operations })).toEqual([
      { campaignId: 1, operationId: 11, campaignName: 'Кампания 1', operationName: 'T28 HTC', isCampaignReward: false }
    ]);
  });

  it('links a whole-campaign reward to the last operation of that campaign', () => {
    expect(rewardMissions({ tankId: 900, campaigns, operations })).toEqual([
      { campaignId: 2, operationId: 21, campaignName: 'Кампания 2', operationName: 'Chimera', isCampaignReward: true }
    ]);
  });

  it('finds nothing for a tank no mission awards', () => {
    expect(rewardMissions({ tankId: 5, campaigns, operations })).toEqual([]);
  });
});
