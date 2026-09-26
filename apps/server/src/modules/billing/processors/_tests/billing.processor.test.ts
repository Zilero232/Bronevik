import type { Job } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { RenewalService } from '../../services';

import { BILLING_QUEUE } from '../../config';
import { BillingProcessor } from '../billing.processor';

const createProcessor = () => {
  const renewals = mock<RenewalService>();

  renewals.chargeDue.mockResolvedValue(3);
  renewals.expireDue.mockResolvedValue(5);

  return { processor: new BillingProcessor(renewals), renewals };
};

describe('BillingProcessor.process', () => {
  it('charges due renewals on a renew job', async () => {
    const { processor, renewals } = createProcessor();

    await expect(processor.process(mock<Job>({ name: BILLING_QUEUE.jobs.renew }))).resolves.toBe(3);
    expect(renewals.expireDue).not.toHaveBeenCalled();
  });

  it('expires lapsed subscriptions on an expire job', async () => {
    const { processor, renewals } = createProcessor();

    await expect(processor.process(mock<Job>({ name: BILLING_QUEUE.jobs.expire }))).resolves.toBe(5);
    expect(renewals.chargeDue).not.toHaveBeenCalled();
  });

  it('ignores a job it does not know', async () => {
    const { processor, renewals } = createProcessor();

    await expect(processor.process(mock<Job>({ name: 'unknown' }))).resolves.toBe(0);
    expect(renewals.chargeDue).not.toHaveBeenCalled();
    expect(renewals.expireDue).not.toHaveBeenCalled();
  });
});
