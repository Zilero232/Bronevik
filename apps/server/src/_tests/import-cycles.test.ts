import madge from 'madge';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SERVER_ROOT = path.resolve(import.meta.dirname, '../..');

// A runtime import cycle through module barrels leaves a class in its temporal dead zone when
// Nest reads the decorator metadata ("Cannot access 'X' before initialization"), and whether it
// bites depends on which entry point loads the cycle first. Type-only imports are erased by Bun,
// so they are skipped; everything else under src/ must stay acyclic.
describe('server import graph', () => {
  it('has no runtime import cycles', async () => {
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
