import madge from 'madge';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const CLIENT_ROOT = path.resolve(import.meta.dirname, '..');
const LAYERS = ['views', 'widgets', 'features', 'entities', 'shared', 'ui-kit'];

describe('client import graph', () => {
  it('has no runtime import cycles between modules of the FSD layers', async () => {
    const graph = await madge(
      LAYERS.map((layer) => path.join(CLIENT_ROOT, layer)),
      {
        baseDir: CLIENT_ROOT,
        fileExtensions: ['ts', 'tsx'],
        tsConfig: path.join(CLIENT_ROOT, 'tsconfig.json'),
        excludeRegExp: [/\/_tests\//, /\/generated\//, /\.d\.ts$/],
        detectiveOptions: {
          ts: { skipTypeImports: true, skipAsyncImports: true },
          tsx: { skipTypeImports: true, skipAsyncImports: true }
        }
      }
    );

    expect(graph.circular().map((cycle) => cycle.join(' -> '))).toEqual([]);
  }, 300_000);
});
