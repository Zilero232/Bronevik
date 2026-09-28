import { describe, expect, it } from 'vitest';

import { readDesignTokens } from '../read-tokens';

describe('readDesignTokens', () => {
  it('reads the theme-independent tokens as CSS text', async () => {
    const { root } = await readDesignTokens();

    expect(root['space-3']).toBe('8px');
    expect(root['radius-lg']).toBe('8px');
    expect(root['ease-out']).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(root['shade-35']).toBe('rgb(0 0 0 / 35%)');
  });

  it('reads both themes with the same token names', async () => {
    const { themes } = await readDesignTokens();

    expect(themes.dark['color-accent']).toBe('#ff7a1a');
    expect(themes.light['color-accent']).toBe('#ab4800');
    expect(themes.dark['elev-2']).toBe('0 1px 0 rgb(255 255 255 / 5%) inset, 0 6px 16px rgb(0 0 0 / 45%)');
    expect(Object.keys(themes.light).sort()).toEqual(Object.keys(themes.dark).sort());
  });
});
