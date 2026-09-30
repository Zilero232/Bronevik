import { readDesignTokens } from '@otmetki/design-tokens';
import { describe, expect, it } from 'vitest';

import { HUD_PROTOCOL } from '../../api/hud-protocol';
import { HUD_TONE_COLORS } from '../hud-tones.constants';

describe('HUD_TONE_COLORS', () => {
  it('has a colour for every tone of the protocol, equal to the dark theme token', async () => {
    const { themes, root } = await readDesignTokens();

    expect(new Set(Object.keys(HUD_TONE_COLORS))).toEqual(new Set(HUD_PROTOCOL.tones));

    Object.values(HUD_TONE_COLORS).forEach(({ token, hex }) => {
      expect((themes.dark[token] ?? root[token])?.toLowerCase(), token).toBe(hex);
    });
  });
});
