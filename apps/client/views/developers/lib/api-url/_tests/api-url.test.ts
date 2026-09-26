import { describe, expect, it } from 'vitest';

import { DEVELOPER_PATHS } from '@/shared/api/developer';

import { apiUrl, apiVersion, trimBaseUrl } from '../api-url';

const BASE = 'https://api.example.test';

describe('trimBaseUrl', () => {
  it('drops every trailing slash and keeps a clean base as is', () => {
    expect(trimBaseUrl(`${BASE}//`)).toBe(BASE);
    expect(trimBaseUrl(BASE)).toBe(BASE);
  });
});

describe('apiUrl', () => {
  it('joins a base and a path with exactly one slash', () => {
    expect(apiUrl({ baseUrl: `${BASE}/`, path: DEVELOPER_PATHS.docs })).toBe(`${BASE}${DEVELOPER_PATHS.docs}`);
    expect(apiUrl({ baseUrl: BASE, path: DEVELOPER_PATHS.docs.slice(1) })).toBe(`${BASE}${DEVELOPER_PATHS.docs}`);
  });

  it('keeps a path prefix on the base', () => {
    expect(apiUrl({ baseUrl: `${BASE}/api`, path: DEVELOPER_PATHS.spec })).toBe(`${BASE}/api${DEVELOPER_PATHS.spec}`);
  });
});

describe('apiVersion', () => {
  it('reads the version segment the docs and the spec share', () => {
    expect(apiVersion(DEVELOPER_PATHS.docs)).toBe(apiVersion(DEVELOPER_PATHS.spec));
    expect(DEVELOPER_PATHS.docs.startsWith(`/${apiVersion(DEVELOPER_PATHS.docs)}/`)).toBe(true);
  });

  it('returns an empty string for a root path', () => {
    expect(apiVersion('/')).toBe('');
  });
});
