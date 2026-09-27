import type { InlineTokensInput, ResolveInput, TokenMap } from './tokens.types';

import { TOKENS } from './tokens.constants';

const themeBlocks = (scss: string): string[] => {
  const blocks: string[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;

  for (const match of scss.matchAll(pattern)) {
    const selector = (match[1] ?? '').replace(/\s+/g, ' ').trim();

    if (TOKENS.themeSelectors.has(selector)) {
      blocks.push(match[2] ?? '');
    }
  }

  return blocks;
};

const resolve = ({ value, raw, depth }: ResolveInput): string | null => {
  if (depth > TOKENS.maxDepth) {
    return null;
  }

  let unresolved = false;
  const resolved = value.replace(TOKENS.variable, (_, name: string) => {
    const next = raw.get(name);
    const inner = next === undefined ? null : resolve({ value: next, raw, depth: depth + 1 });

    if (inner === null) {
      unresolved = true;

      return '';
    }

    return inner;
  });

  return unresolved ? null : resolved;
};

export const legacyColor = (value: string): string =>
  value.replace(TOKENS.modernRgb, (_, red: string, green: string, blue: string, alpha: string) => {
    const opacity = alpha.endsWith('%') ? Number.parseFloat(alpha) / 100 : Number.parseFloat(alpha);

    return `rgba(${red}, ${green}, ${blue}, ${Number(opacity.toFixed(3))})`;
  });

export const gamefaceValue = (value: string): string => legacyColor(value).replace(TOKENS.pixels, '$1rem');

export const parseTokens = (scss: string): TokenMap => {
  const raw = new Map<string, string>();

  for (const block of themeBlocks(scss)) {
    for (const match of block.matchAll(TOKENS.declaration)) {
      raw.set(match[1] ?? '', (match[2] ?? '').replace(/\s+/g, ' ').trim());
    }
  }

  const tokens = new Map<string, string>();

  for (const [name, value] of raw) {
    const resolved = resolve({ value, raw, depth: 0 });

    if (resolved !== null) {
      tokens.set(name, gamefaceValue(resolved));
    }
  }

  return tokens;
};

export const inlineTokens = ({ css, tokens }: InlineTokensInput): string => {
  const missing = new Set<string>();
  const inlined = css.replace(TOKENS.variable, (_, name: string) => {
    const value = tokens.get(name);

    if (value === undefined) {
      missing.add(name);

      return '';
    }

    return value;
  });

  if (missing.size > 0) {
    throw new Error(`Unknown design tokens: ${[...missing].join(', ')}`);
  }

  return inlined;
};
