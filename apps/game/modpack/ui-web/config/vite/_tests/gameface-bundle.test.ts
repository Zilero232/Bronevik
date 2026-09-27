import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build, mergeConfig } from 'vite';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { buttonConfig } from '../button';
import { settingsConfig } from '../settings';
import { UI_BUILD } from '../vite.constants';

const BUNDLE_FILES = ['button.css', 'button.html', 'button.js', 'icon.png', 'index.html'];
const IIFE_START = /^\(function\(\)\{/;
const CLASSIC_SCRIPT_AT_BODY_END = /<script>\(function\(\)\{[\s\S]*\}\)\(\);<\/script>\s*<\/body>\s*<\/html>\s*$/;
const POLYFILLED_ELEMENTS = /[\w$]\([`'"](?:ul|ol|li|dl|dt|dd|select|option)[`'"][,)]/;

let outDir = '';

const read = (dir: string, file: string): Promise<string> => readFile(path.join(dir, file), 'utf8');

beforeAll(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), 'otmetki-ui-'));
  vi.stubEnv('NODE_ENV', 'production');

  for (const config of [settingsConfig(), buttonConfig()]) {
    await build(mergeConfig(config, { configFile: false, logLevel: 'silent', build: { outDir } }));
  }
}, 60_000);

afterAll(async () => {
  vi.unstubAllEnvs();
  await rm(outDir, { recursive: true, force: true });
});

describe('committed Gameface bundle', () => {
  it('matches a fresh build of ui-web (run `bun run ui:build` in apps/game/modpack)', async () => {
    const files = (await readdir(outDir)).sort();

    expect(files).toEqual(BUNDLE_FILES);
    expect((await readdir(UI_BUILD.outDir)).sort()).toEqual(files);

    for (const file of files) {
      const [fresh, committed] = await Promise.all([readFile(path.join(outDir, file)), readFile(path.join(UI_BUILD.outDir, file))]);

      expect(fresh.equals(committed), file).toBe(true);
    }
  });

  it('loads the settings window with one classic inline script at the end of the body, as the client pages do', async () => {
    const page = await read(outDir, 'index.html');

    expect(page).not.toContain('type="module"');
    expect(page.match(/<script/g)).toHaveLength(1);
    expect(page).toMatch(CLASSIC_SCRIPT_AT_BODY_END);
  });

  it('builds the hangar button as a self-contained IIFE', async () => {
    const script = await read(outDir, 'button.js');

    expect(script).toMatch(IIFE_START);
    expect(script).not.toMatch(/\bimport\s*[({'"`]|\bexport\s/);
  });

  it('renders no list or select elements, which Gameface only supports through a polyfill', async () => {
    const [page, button] = await Promise.all([read(outDir, 'index.html'), read(outDir, 'button.js')]);

    expect(page).not.toMatch(POLYFILLED_ELEMENTS);
    expect(button).not.toMatch(POLYFILLED_ELEMENTS);
  });
});
