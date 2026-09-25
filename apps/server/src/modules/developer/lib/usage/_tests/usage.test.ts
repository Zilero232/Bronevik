import { describe, expect, it } from 'vitest';

import { API_USAGE } from '../../../config';
import { addCounters, emptyCounters, endpointLabel, topEndpoints, usageDay, usagePointOf, usagePoints } from '../usage';

const row = ({
  day,
  endpoint,
  requests,
  latencyMsTotal = requests * 10
}: {
  day: string;
  endpoint: string;
  requests: number;
  latencyMsTotal?: number;
}) => ({
  day,
  endpoint,
  requests,
  errors: 0,
  throttled: 0,
  latencyMsTotal
});

describe('usageDay', () => {
  it('uses the UTC calendar day', () => {
    expect(usageDay(new Date('2026-09-25T23:30:00-03:00'))).toBe('2026-09-26');
  });
});

describe('endpointLabel', () => {
  it('names the route pattern, not the concrete path', () => {
    expect(endpointLabel({ method: 'get', route: '/v1/players/:id' })).toBe('GET /v1/players/:id');
  });

  it('groups unmatched requests together', () => {
    expect(endpointLabel({ method: 'GET', route: undefined })).toBe(`GET ${API_USAGE.unmatchedEndpoint}`);
  });
});

describe('addCounters', () => {
  it('adds every counter', () => {
    const one = { requests: 1, errors: 1, throttled: 0, latencyMs: 5 };

    expect(addCounters({ left: one, right: one })).toEqual({ requests: 2, errors: 2, throttled: 0, latencyMs: 10 });
    expect(addCounters({ left: emptyCounters(), right: one })).toEqual(one);
  });
});

describe('usagePoints', () => {
  it('sums the endpoints of a day and averages the latency per request', () => {
    const [point] = usagePoints([
      row({ day: '2026-09-25', endpoint: 'GET /a', requests: 2, latencyMsTotal: 30 }),
      row({ day: '2026-09-25', endpoint: 'GET /b', requests: 1, latencyMsTotal: 30 })
    ]);

    expect(point).toEqual({ day: '2026-09-25', requests: 3, errors: 0, throttled: 0, avgLatencyMs: 20 });
  });

  it('orders the days', () => {
    const days = usagePoints([
      row({ day: '2026-09-26', endpoint: 'GET /a', requests: 1 }),
      row({ day: '2026-09-24', endpoint: 'GET /a', requests: 1 })
    ]).map((point) => point.day);

    expect(days).toEqual(['2026-09-24', '2026-09-26']);
  });
});

describe('usagePointOf', () => {
  it('reports a day without requests as zero with no latency', () => {
    expect(usagePointOf({ rows: [], day: '2026-09-25' })).toEqual({ day: '2026-09-25', requests: 0, errors: 0, throttled: 0, avgLatencyMs: null });
  });
});

describe('topEndpoints', () => {
  it('ranks the busiest endpoints first and keeps only the top ones', () => {
    const rows = Array.from({ length: API_USAGE.topEndpoints + 2 }, (_, index) =>
      row({ day: '2026-09-25', endpoint: `GET /${index}`, requests: index + 1 })
    );

    const top = topEndpoints(rows);

    expect(top).toHaveLength(API_USAGE.topEndpoints);
    expect(top[0]?.requests).toBeGreaterThan(top[1]?.requests ?? 0);
  });
});
