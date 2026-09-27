import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { BUILD } from '../../build.constants';
import { gamefaceValue, inlineTokens, legacyColor, parseTokens } from '../tokens';

const SCSS = `
:root {
  --space: 4px;
  --radius-lg: 8px;
  --font-sans: var(--font-body), system-ui;
}

:root,
[data-theme='dark'] {
  --color-bg: #18181b;
  --color-accent: #ff7a1a;
  --color-accent-soft: rgb(255 122 26 / 14%);
  --panel: var(--color-bg);
}

[data-theme='light'] {
  --color-bg: #ffffff;
}
`;

describe('parseTokens', () => {
  it('reads the root and dark blocks and never the light theme', () => {
    const tokens = parseTokens(SCSS);

    expect(tokens.get('--color-bg')).toBe('#18181b');
    expect(tokens.get('--panel')).toBe('#18181b');
    expect(tokens.get('--radius-lg')).toBe('8rem');
  });

  it('drops tokens that depend on runtime variables', () => {
    expect(parseTokens(SCSS).has('--font-sans')).toBe(false);
  });

  it('writes colours Gameface parses', () => {
    expect(parseTokens(SCSS).get('--color-accent-soft')).toBe('rgba(255, 122, 26, 0.14)');
    expect(legacyColor('rgb(0 0 0 / 0.5)')).toBe('rgba(0, 0, 0, 0.5)');
    expect(gamefaceValue('0 1px 2px rgb(0 0 0 / 40%)')).toBe('0 1rem 2rem rgba(0, 0, 0, 0.4)');
  });

  it('finds every token the stylesheets use in the site tokens', () => {
    const tokens = parseTokens(readFileSync(BUILD.tokensFile, 'utf8'));

    for (const bundle of BUILD.bundles) {
      const css = readFileSync(`${BUILD.root}/${bundle.style.source}`, 'utf8');

      expect(() => inlineTokens({ css, tokens })).not.toThrow();
    }
  });
});

describe('inlineTokens', () => {
  it('replaces variables and refuses unknown ones', () => {
    const tokens = parseTokens(SCSS);

    expect(inlineTokens({ css: 'a{color:var(--color-accent)}', tokens })).toBe('a{color:#ff7a1a}');
    expect(() => inlineTokens({ css: 'a{color:var(--nope)}', tokens })).toThrow('--nope');
  });
});
