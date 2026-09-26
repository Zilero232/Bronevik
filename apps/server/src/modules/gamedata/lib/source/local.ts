import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { CreateLocalReaderInput, CreateLocalRepoReaderInput, CreateMemoryReaderInput, RepoReader, SourceReader } from './source.types';

import { GAME_DATA_SOURCES } from './source.constants';

export const createLocalRepoReader = ({ source, root, sha = 'local' }: CreateLocalRepoReaderInput): RepoReader => ({
  revision: { owner: source.owner, repo: source.repo, ref: source.ref, sha },
  read: async (path) =>
    readFile(join(root, path), 'utf8').catch((error: unknown) => {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return undefined;
      }

      throw error;
    })
});

export const createLocalReader = ({ sourceId, root, sha }: CreateLocalReaderInput): SourceReader => {
  const { revision, read } = createLocalRepoReader({ source: GAME_DATA_SOURCES[sourceId], root, sha });

  return { revision: { sourceId, ...revision }, read };
};

export const createMemoryReader = ({ sourceId, files }: CreateMemoryReaderInput): SourceReader => {
  const source = GAME_DATA_SOURCES[sourceId];

  return {
    revision: { sourceId, owner: source.owner, repo: source.repo, ref: source.ref, sha: 'memory' },
    read: async (path) => files[path]
  };
};
