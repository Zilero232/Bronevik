// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { bundlePanelScript, readPanelScript } from '../panel-script';

describe('public/twitch-panel.js', () => {
  it('matches a fresh bundle of the panel script (run `bun run panel:build` after changing it)', async () => {
    expect(await readPanelScript()).toBe(await bundlePanelScript());
  });
});
