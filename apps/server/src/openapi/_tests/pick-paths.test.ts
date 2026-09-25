import type { OpenAPIObject } from '@nestjs/swagger';

import { describe, expect, it } from 'vitest';

import { OPENAPI } from '../openapi.constants';
import { pickPaths } from '../pick-paths';

const ref = (name: string) => ({ $ref: `${OPENAPI.refPrefix}${name}` });
const publicPath = `${OPENAPI.public.prefix}players`;

const document: OpenAPIObject = {
  openapi: '3.0.0',
  info: { title: 'test', version: '1' },
  tags: [{ name: 'players' }, { name: 'internal' }],
  paths: {
    [publicPath]: {
      get: {
        tags: ['players'],
        responses: { 200: { description: 'ok', content: { 'application/json': { schema: ref('Player') } } } }
      }
    },
    '/internal/admin': {
      post: {
        tags: ['internal'],
        responses: { 200: { description: 'ok', content: { 'application/json': { schema: ref('Admin') } } } }
      }
    }
  },
  components: {
    schemas: {
      Player: { type: 'object', properties: { clan: ref('Clan'), stats: { type: 'array', items: ref('Stats') } } },
      Clan: { type: 'object', properties: { leader: ref('Player') } },
      Stats: { type: 'object' },
      Admin: { type: 'object', properties: { stats: ref('Stats') } },
      Orphan: { type: 'object' }
    }
  }
};

describe('pickPaths', () => {
  const picked = pickPaths({ document, prefix: OPENAPI.public.prefix });

  it('keeps only the paths under the prefix', () => {
    expect(Object.keys(picked.paths)).toEqual([publicPath]);
  });

  it('keeps every schema reachable through references, including cycles', () => {
    expect(Object.keys(picked.components?.schemas ?? {}).sort()).toEqual(['Clan', 'Player', 'Stats']);
  });

  it('keeps only the tags the remaining operations use', () => {
    expect(picked.tags).toEqual([{ name: 'players' }]);
  });

  it('returns an empty document when nothing matches the prefix', () => {
    const empty = pickPaths({ document, prefix: '/missing/' });

    expect(empty.paths).toEqual({});
    expect(empty.components?.schemas).toEqual({});
    expect(empty.tags).toEqual([]);
  });

  it('keeps the rest of the document untouched', () => {
    expect(picked.info).toBe(document.info);
    expect(picked.openapi).toBe(document.openapi);
  });
});
