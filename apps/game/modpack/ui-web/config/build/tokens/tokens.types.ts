export type TokenMap = ReadonlyMap<string, string>;

export type InlineTokensInput = {
  css: string;
  tokens: TokenMap;
};

export type ResolveInput = {
  value: string;
  raw: ReadonlyMap<string, string>;
  depth: number;
};
