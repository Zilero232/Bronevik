export type LocalizedDescription = {
  description: string;
  description_localizations: Record<string, string>;
};

export type CommandDefinitionsInput = {
  describe: (key: string) => LocalizedDescription;
};
