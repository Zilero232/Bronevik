import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { CreateLocalReaderInput, CreateMemoryReaderInput, SourceReader } from './source.types';

import { GAME_DATA_SOURCES } from './source.constants';

export const createLocalReader = ({ sourceId, root, sha = 'local' }: CreateLocalReaderInput): SourceReader => {
  const source = GAME_DATA_SOURCES[sourceId];

  return {
    revision: { sourceId, owner: source.owner, repo: source.repo, ref: source.ref, sha },
    read: async (path) =>
      readFile(join(root, path), 'utf8').catch((error: unknown) => {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          return undefined;
        }

        throw error;
      })
  };
};

export const createMemoryReader = ({ sourceId, files }: CreateMemoryReaderInput): SourceReader => {
  const source = GAME_DATA_SOURCES[sourceId];

  return {
    revision: { sourceId, owner: source.owner, repo: source.repo, ref: source.ref, sha: 'memory' },
    read: async (path) => files[path]
  };
};
