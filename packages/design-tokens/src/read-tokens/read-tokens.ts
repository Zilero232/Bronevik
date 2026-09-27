import type { Value } from 'sass-embedded';

import { compileStringAsync, sassNull } from 'sass-embedded';

import type { DesignTokens, Theme, TokenValues } from './read-tokens.types';

import { READ_TOKENS } from './read-tokens.constants';

const entriesOf = (value: Value): [Value, Value][] => [...value.assertMap().contents.entries()];

const valuesOf = (value: Value): TokenValues =>
  Object.fromEntries(entriesOf(value).map(([name, token]) => [name.assertString().text, token.assertString().text]));

const isTheme = (name: string): name is Theme => name === 'dark' || name === 'light';

const themesOf = (value: Value): Record<Theme, TokenValues> => {
  const themes: Partial<Record<Theme, TokenValues>> = {};

  for (const [name, map] of entriesOf(value)) {
    const theme = name.assertString().text;

    if (isTheme(theme)) {
      themes[theme] = valuesOf(map);
    }
  }

  if (!themes.dark || !themes.light) {
    throw new Error('Design tokens: the dark or the light theme is missing');
  }

  return { dark: themes.dark, light: themes.light };
};

export const readDesignTokens = async (): Promise<DesignTokens> => {
  const captured: DesignTokens[] = [];

  await compileStringAsync(READ_TOKENS.source, {
    loadPaths: [READ_TOKENS.loadPath],
    functions: {
      [READ_TOKENS.capture]: ([root, themes]) => {
        if (root && themes) {
          captured.push({ root: valuesOf(root), themes: themesOf(themes) });
        }

        return sassNull;
      }
    }
  });

  const [tokens] = captured;

  if (!tokens) {
    throw new Error('Design tokens: the SCSS maps were not captured');
  }

  return tokens;
};
