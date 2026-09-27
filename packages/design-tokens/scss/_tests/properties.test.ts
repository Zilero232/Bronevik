import path from 'node:path';
import { compileStringAsync } from 'sass-embedded';
import { describe, expect, it } from 'vitest';

const PACKAGE_ROOT = path.resolve(import.meta.dirname, '../..');

const compile = async (source: string): Promise<string> => {
  const { css } = await compileStringAsync(`@use 'index' as tokens;\n${source}`, { loadPaths: [PACKAGE_ROOT] });

  return css;
};

describe('design tokens SCSS', () => {
  it('emits every theme token verbatim as a custom property', async () => {
    const css = await compile('a { @include tokens.theme-properties(dark); }');

    expect(css).toContain('--color-accent: #ff7a1a;');
    expect(css).toContain('--color-accent-soft: rgb(255 122 26 / 14%);');
    expect(css).toContain('--panel-gradient: var(--surface-sheen), var(--color-surface);');
  });

  it('resolves one token to its static value', async () => {
    const css = await compile('a { color: tokens.token(color-accent); border-radius: tokens.token(radius-lg); b: tokens.token(color-bg, light); }');

    expect(css).toContain('color: #ff7a1a;');
    expect(css).toContain('border-radius: 8px;');
    expect(css).toContain('b: #f1f1f3;');
  });

  it('refuses unknown tokens, themes and palettes', async () => {
    await expect(compile('a { color: tokens.token(nope); }')).rejects.toThrow('Unknown design token `nope`');
    await expect(compile('a { @include tokens.theme-properties(sepia); }')).rejects.toThrow('Unknown theme');
    await expect(compile('a { @include tokens.rating-palette-properties(nope, dark); }')).rejects.toThrow('Unknown rating palette');
  });
});
