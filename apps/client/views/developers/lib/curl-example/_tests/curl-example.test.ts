import { API_KEY } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import type { OpenApiParameter } from '@/shared/api/developer';

import { buildCurlExample, sampleValue, trimBaseUrl } from '../curl-example';

const BASE = 'https://api.example.test/';

const PARAMETERS: OpenApiParameter[] = [
  { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
  { name: 'metric', in: 'query', required: true, schema: { type: 'string', enum: ['wn8', 'winRate'] } },
  { name: 'from', in: 'query', required: false, schema: { type: 'string' } }
];

describe('sampleValue', () => {
  it('prefers the first enum value over the type sample', () => {
    expect(sampleValue({ name: 'metric', schema: { type: 'string', enum: ['wn8', 'winRate'] } })).toBe('wn8');
  });

  it('gives numeric parameters a number and unknown ones a non-empty word', () => {
    expect(Number.isFinite(Number(sampleValue({ name: 'offset', schema: { type: 'integer' } })))).toBe(true);
    expect(sampleValue({ name: 'mystery' }).length).toBeGreaterThan(0);
  });
});

describe('buildCurlExample', () => {
  const curl = buildCurlExample({ baseUrl: BASE, method: 'get', path: '/v1/players/{id}/history', parameters: PARAMETERS });

  it('resolves every path placeholder so curl does not glob the braces', () => {
    expect(curl).not.toMatch(/[{}]/);
    expect(curl).toContain(`${trimBaseUrl(BASE)}/v1/players/${sampleValue(PARAMETERS[0] ?? { name: 'id' })}/history`);
  });

  it('adds required query parameters and leaves optional ones out', () => {
    expect(curl).toContain('?metric=wn8');
    expect(curl).not.toContain('from=');
  });

  it('never doubles the slash between the base URL and the path', () => {
    expect(curl).not.toContain('test//v1');
  });

  it('sends the key header from an environment variable', () => {
    expect(curl).toContain(`${API_KEY.header}: $`);
  });

  it('spells the verb out only for non-GET methods', () => {
    expect(curl).not.toContain('-X');
    expect(buildCurlExample({ baseUrl: BASE, method: 'delete', path: '/v1/x', parameters: [] })).toContain('-X DELETE');
  });

  it('fills placeholders the operation forgot to declare', () => {
    expect(buildCurlExample({ baseUrl: BASE, method: 'get', path: '/v1/clans/{clanId}', parameters: [] })).not.toMatch(/[{}]/);
  });
});
