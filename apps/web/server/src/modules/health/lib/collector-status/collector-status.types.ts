export type QueueCounts = Readonly<Record<string, number>>;

export type CountOfInput = {
  counts: QueueCounts;
  states: readonly string[];
};

type GameFilesImport = {
  version: string;
  importedAt: string | null;
};

export type CollectorJobsInput = {
  successes: Readonly<Record<string, string>>;
  xvmVersion: string | null;
  gameFiles: GameFilesImport | null;
};
