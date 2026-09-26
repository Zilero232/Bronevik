import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../../config';

import { JOB_SCHEDULES } from '../../../../common/lib';
import { BILLING_SCHEDULES } from '../../config';
import { BillingSchedulesService } from '../billing-schedules.service';

const createService = (nodeEnv: 'production' | 'test') => {
  const config = mock<AppConfigService>();
  const queue = mock<Queue>();

  config.get.mockReturnValue(nodeEnv);

  return { service: new BillingSchedulesService(config, queue), queue };
};

describe('BillingSchedulesService.onApplicationBootstrap', () => {
  it('registers no schedulers under tests', async () => {
    const { service, queue } = createService('test');

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
  });

  it('registers every billing schedule in the schedules timezone', async () => {
    const { service, queue } = createService('production');

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler.mock.calls.map(([id]) => id)).toEqual(BILLING_SCHEDULES.map(({ id }) => id));

    for (const schedule of BILLING_SCHEDULES) {
      expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
        schedule.id,
        { pattern: schedule.repeat.pattern, tz: JOB_SCHEDULES.timezone },
        expect.objectContaining({ name: schedule.name })
      );
    }
  });
});
