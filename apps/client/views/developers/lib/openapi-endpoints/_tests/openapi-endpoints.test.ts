import { describe, expect, it } from 'vitest';

import type { OpenApiDocument } from '@/shared/api/developer';

import { filterEndpointGroups, groupEndpoints, pathSegments, tagLabel } from '../openapi-endpoints';
import { OPENAPI_ENDPOINTS } from '../openapi-endpoints.constants';

const SPEC: OpenApiDocument = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1' },
  paths: {
    '/v1/players/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        { name: 'trace', in: 'header' }
      ],
      get: {
        operationId: 'getPlayer',
        summary: 'Player summary',
        tags: ['v1-players'],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'own', schema: { type: 'integer' } }],
        responses: { '200': { description: '' }, '404': { description: 'PLAYER_NOT_FOUND' } }
      },
      delete: { summary: 'Forget a player', tags: ['v1-players'] }
    },
    '/v1/tanks': {
      get: { operationId: 'listTanks', summary: 'Server tank statistics', tags: ['v1-tanks'] },
      summary: 'not an operation'
    },
    '/v1/health': {
      get: { description: 'Liveness probe' },
      post: 'broken'
    }
  }
};

describe('groupEndpoints', () => {
  const groups = groupEndpoints(SPEC);
  const endpoints = groups.flatMap((group) => group.endpoints);

  it('keeps only HTTP methods whose operation parses', () => {
    expect(endpoints.map(({ id }) => id).sort()).toEqual(['delete /v1/players/{id}', 'get /v1/health', 'get /v1/players/{id}', 'get /v1/tanks']);
  });

  it('groups by the first tag in first-appearance order and files untagged operations under the fallback tag', () => {
    expect(groups.map(({ tag }) => tag)).toEqual(['v1-players', 'v1-tanks', OPENAPI_ENDPOINTS.fallbackTag]);
  });

  it('merges path-level parameters without letting them override the operation', () => {
    const player = endpoints.find(({ id }) => id === 'get /v1/players/{id}');

    expect(player?.parameters.map(({ in: location, name }) => `${location}:${name}`)).toEqual(['path:id', 'header:trace']);
    expect(player?.parameters[0]?.description).toBe('own');
  });

  it('falls back to the description when the summary is missing and turns empty descriptions into null', () => {
    const health = endpoints.find(({ id }) => id === 'get /v1/health');
    const player = endpoints.find(({ id }) => id === 'get /v1/players/{id}');

    expect(health?.summary).toBe('Liveness probe');

    expect(player?.responses).toEqual([
      { status: '200', description: null },
      { status: '404', description: 'PLAYER_NOT_FOUND' }
    ]);
  });
});

describe('filterEndpointGroups', () => {
  const groups = groupEndpoints(SPEC);

  it('returns every group for a blank query', () => {
    expect(filterEndpointGroups({ groups, query: '   ' })).toBe(groups);
  });

  it('requires every token to match and drops groups left empty', () => {
    const result = filterEndpointGroups({ groups, query: 'DELETE players' });

    expect(result.map(({ tag }) => tag)).toEqual(['v1-players']);
    expect(result[0]?.endpoints.map(({ method }) => method)).toEqual(['delete']);
  });

  it('matches the tag label without its version prefix', () => {
    expect(filterEndpointGroups({ groups, query: 'tanks' }).flatMap(({ endpoints }) => endpoints.map(({ id }) => id))).toEqual(['get /v1/tanks']);
  });

  it('returns nothing when no endpoint matches', () => {
    expect(filterEndpointGroups({ groups, query: 'nope-nothing' })).toEqual([]);
  });
});

describe('pathSegments', () => {
  it('marks placeholders and keeps the text round-trippable', () => {
    const segments = pathSegments('/v1/players/{id}/sessions/{sessionId}');

    expect(segments.map(({ text }) => text).join('')).toBe('/v1/players/{id}/sessions/{sessionId}');
    expect(segments.filter(({ isParam }) => isParam).map(({ text }) => text)).toEqual(['{id}', '{sessionId}']);
  });
});

describe('tagLabel', () => {
  it('strips the version prefix only', () => {
    expect(tagLabel('v1-players')).toBe('players');
    expect(tagLabel('players-v1')).toBe('players-v1');
  });
});
