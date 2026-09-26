export type ReplayFileRules = {
  maxBytes: number;
  extensions: readonly string[];
};

export type ValidateReplayFileInput = {
  file: Pick<File, 'name' | 'size'>;
  rules: ReplayFileRules;
};

export type ReplayFileProblem = 'empty' | 'extension' | 'size';
