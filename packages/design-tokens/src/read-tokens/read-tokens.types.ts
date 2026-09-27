export type Theme = 'dark' | 'light';

export type TokenValues = Readonly<Record<string, string>>;

export type DesignTokens = {
  root: TokenValues;
  themes: Readonly<Record<Theme, TokenValues>>;
};
