import type { RepoReader } from '../source';

export type LocalizedMessages = Record<string, string>;

export type LoadLocalizationInput = {
  reader: RepoReader;
  keys: readonly (string | undefined)[];
};

export type TranslateInput = {
  messages: LocalizedMessages;
  key: string | undefined;
};
