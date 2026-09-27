import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

import { bundleFiles, outputPath } from '../bundle';

describe('committed Gameface bundle', () => {
  it('matches a fresh build of ui-web (run `bun run ui:build` in apps/modpack)', async () => {
    const files = await bundleFiles();

    expect(files.map(({ name }) => name).sort()).toEqual([
      'button.css',
      'button.html',
      'button.js',
      'icon.png',
      'index.css',
      'index.html',
      'index.js'
    ]);

    for (const file of files) {
      const committed = await readFile(outputPath(file));

      expect(Buffer.from(file.contents).equals(committed)).toBe(true);
    }
  }, 30_000);
});
