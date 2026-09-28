import { describe, expect, it } from 'vitest';

import { devServerExperimental } from '../dev-server';

describe('devServerExperimental', () => {
  it('leaves builds untouched', () => {
    expect(devServerExperimental(false)).toEqual({});
  });

  it('bounds the dev server memory', () => {
    expect(devServerExperimental(true)).toMatchObject({
      turbopackFileSystemCacheForDev: true,
      turbopackMemoryEviction: 'full',
      reactDebugChannel: false,
      turbopackRustReactCompiler: true
    });
  });
});
