import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { LestaClients } from '../../../../../core';

import { TRACKING } from '../../config';
import { TrackingLestaService } from '../tracking-lesta.service';

const createLesta = () => {
  const clients = mockDeep<LestaClients>();

  return { clients, service: new TrackingLestaService(clients) };
};

describe('TrackingLestaService.port', () => {
  it('routes every call through the chosen lane', async () => {
    const { clients, service } = createLesta();

    clients.bulk.account.info.mockResolvedValue({});

    await service.port('bulk').accountInfo([1]);

    expect(clients.bulk.account.info).toHaveBeenCalledWith(expect.objectContaining({ accountIds: [1] }));
    expect(clients.priority.account.info).not.toHaveBeenCalled();
  });

  it('maps tank achievements to marks per tank, defaulting to zero marks', async () => {
    const { clients, service } = createLesta();

    clients.priority.tanks.achievements.mockResolvedValue([
      { tank_id: 10, achievements: { [TRACKING.lesta.marksAchievement]: 3 } },
      { tank_id: 11, achievements: {} }
    ]);

    const marks = await service.port('priority').tankMarks({ accountId: 1, tankIds: [10, 11] });

    expect(Object.fromEntries(marks)).toEqual({ 10: 3, 11: 0 });
  });
});
