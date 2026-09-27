import madge from 'madge';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SERVER_ROOT = path.resolve(import.meta.dirname, '../..');

describe('server import graph', () => {
  it('has no runtime import cycles, which would leave a decorated class in its temporal dead zone', async () => {
    const graph = await madge(path.join(SERVER_ROOT, 'src'), {
      baseDir: SERVER_ROOT,
      fileExtensions: ['ts'],
      tsConfig: path.join(SERVER_ROOT, 'tsconfig.json'),
      excludeRegExp: [/\/_tests\//],
      detectiveOptions: { ts: { skipTypeImports: true, skipAsyncImports: true } }
    });

    expect(graph.circular().map((cycle) => cycle.join(' -> '))).toEqual([]);
  }, 120_000);
});
