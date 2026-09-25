import { describe, expect, it } from 'vitest';

import type { LestaOutcome } from '../../../lib/lesta';

import { LESTA_ERROR_CODE } from '../../../lib/lesta';
import { bulkRequestsPerSecond, meteredFetch } from '../lesta.factory';

describe('bulkRequestsPerSecond', () => {
  it('leaves the reserved share of the budget to tier A', () => {
    const requestsPerSecond = 20;
    const reserve = 0.2;

    expect(bulkRequestsPerSecond({ requestsPerSecond, reserve })).toBeLessThanOrEqual(requestsPerSecond * (1 - reserve));
  });

  it('never drops tier B to zero', () => {
    expect(bulkRequestsPerSecond({ requestsPerSecond: 1, reserve: 0.9 })).toBe(1);
  });
});

describe('meteredFetch', () => {
  const run = async (respond: () => Promise<Response>) => {
    const outcomes: LestaOutcome[] = [];
    const fetch = meteredFetch({ fetch: respond, record: (outcome) => outcomes.push(outcome) });

    return { outcomes, result: await fetch('https://api.tanki.su/wot/account/info/', { method: 'POST' }).catch((error: unknown) => error) };
  };

  it('records the rate-limit envelope as degraded and still returns the body', async () => {
    const body = JSON.stringify({ status: 'error', error: { code: 407, message: LESTA_ERROR_CODE.requestLimitExceeded } });
    const { outcomes, result } = await run(async () => new Response(body));

    expect(outcomes).toEqual(['degraded']);
    expect(result).toBeInstanceOf(Response);
    expect(result instanceof Response ? await result.text() : '').toBe(body);
  });

  it('records a network failure as degraded and rethrows it', async () => {
    const { outcomes, result } = await run(async () => {
      throw new Error('ECONNRESET');
    });

    expect(outcomes).toEqual(['degraded']);
    expect(result).toBeInstanceOf(Error);
  });
});
