import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build, mergeConfig } from 'vite';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { buttonConfig } from '../button';
import { settingsConfig } from '../settings';
import { UI_BUILD } from '../vite.constants';

const outDirs: string[] = [];

const freshBuild = async (): Promise<string> => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'otmetki-ui-'));

  outDirs.push(outDir);
  vi.stubEnv('NODE_ENV', 'production');

  for (const config of [settingsConfig(), buttonConfig()]) {
    await build(mergeConfig(config, { configFile: false, logLevel: 'silent', build: { outDir } }));
  }

  return outDir;
};

afterAll(async () => {
  vi.unstubAllEnvs();
  await Promise.all(outDirs.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('committed Gameface bundle', () => {
  it('matches a fresh build of ui-web (run `bun run ui:build` in apps/game/modpack)', async () => {
    const outDir = await freshBuild();
    const files = (await readdir(outDir)).sort();

    expect(files).toEqual(['button.css', 'button.html', 'button.js', 'icon.png', 'index.html']);
    expect((await readdir(UI_BUILD.outDir)).sort()).toEqual(files);

    for (const file of files) {
      const [fresh, committed] = await Promise.all([readFile(path.join(outDir, file)), readFile(path.join(UI_BUILD.outDir, file))]);

      expect(fresh.equals(committed), file).toBe(true);
    }
  }, 60_000);
});
