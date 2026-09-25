import type { GAME_DATA_SOURCES } from './source.constants';

type GameDataSourceId = keyof typeof GAME_DATA_SOURCES;

type GameDataSource = (typeof GAME_DATA_SOURCES)[GameDataSourceId];

export type SourceRevision = {
  sourceId: GameDataSourceId;
  owner: string;
  repo: string;
  ref: string;
  sha: string;
  committedAt?: string;
};

export type SourceReader = {
  revision: SourceRevision;
  read: (path: string) => Promise<string | undefined>;
};

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type CreateGithubReaderInput = {
  sourceId: GameDataSourceId;
  ref?: string;
  cacheDir: string;
  token?: string;
  concurrency?: number;
  retryDelayMs?: number;
  fetch?: FetchLike;
};

export type CreateLocalReaderInput = {
  sourceId: GameDataSourceId;
  root: string;
  sha?: string;
};

export type ResolveCommitInput = {
  source: GameDataSource;
  ref: string;
  token?: string;
  fetch: FetchLike;
};

export type RawUrlInput = {
  owner: string;
  repo: string;
  sha: string;
  path: string;
};

export type MinimapUrlInput = {
  sourceId: GameDataSourceId;
  path: string;
};

export type ResolvedCommit = {
  sha: string;
  committedAt?: string;
};

export type CreateMemoryReaderInput = {
  sourceId: GameDataSourceId;
  files: Record<string, string>;
};
