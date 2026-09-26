import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import pLimit from 'p-limit';
import pRetry, { AbortError } from 'p-retry';
import { z } from 'zod';

import type {
  CreateGithubReaderInput,
  CreateRepoReaderInput,
  MinimapUrlInput,
  RawUrlInput,
  RepoReader,
  ResolveCommitInput,
  ResolvedCommit,
  SourceReader
} from './source.types';

import { FETCH, GAME_DATA_SOURCES, GITHUB, MINIMAP_SOURCES } from './source.constants';

const COMMIT_SHA = /^[0-9a-f]{40}$/i;

const commitResponseSchema = z.object({
  sha: z.string(),
  commit: z.object({ committer: z.object({ date: z.string() }).nullish() }).nullish()
});

const exists = async (path: string): Promise<boolean> =>
  stat(path).then(
    () => true,
    () => false
  );

const headers = (token: string | undefined): Record<string, string> => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': GITHUB.userAgent,
  'X-GitHub-Api-Version': GITHUB.apiVersion,
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export const rawUrl = ({ owner, repo, sha, path }: RawUrlInput): string =>
  `${GITHUB.raw}/${owner}/${repo}/${sha}/${path.split('/').map(encodeURIComponent).join('/')}`;

export const minimapUrl = ({ sourceId, path }: MinimapUrlInput): string => {
  const source = MINIMAP_SOURCES[sourceId];

  return rawUrl({ owner: source.owner, repo: source.repo, sha: source.ref, path });
};

const resolveCommit = async ({ source, ref, token, fetch }: ResolveCommitInput): Promise<ResolvedCommit> => {
  const response = await fetch(`${GITHUB.api}/repos/${source.owner}/${source.repo}/commits/${encodeURIComponent(ref)}`, {
    headers: headers(token)
  });

  if (!response.ok) {
    if (COMMIT_SHA.test(ref)) {
      return { sha: ref.toLowerCase() };
    }

    throw new Error(`GitHub ${response.status} resolving ${source.owner}/${source.repo}@${ref}`);
  }

  const body = commitResponseSchema.parse(await response.json());

  return { sha: body.sha, committedAt: body.commit?.committer?.date };
};

export const createRepoReader = async ({
  source,
  ref,
  cacheDir,
  token,
  concurrency = FETCH.concurrency,
  retryDelayMs = FETCH.retryDelayMs,
  fetch: fetchImpl = fetch
}: CreateRepoReaderInput): Promise<RepoReader> => {
  const commit = await resolveCommit({ source, ref: ref ?? source.ref, token, fetch: fetchImpl });
  const root = join(cacheDir, source.owner, source.repo, commit.sha);
  const limit = pLimit(concurrency);

  const download = async (path: string): Promise<string | undefined> =>
    pRetry(
      async () => {
        const response = await fetchImpl(rawUrl({ owner: source.owner, repo: source.repo, sha: commit.sha, path }), {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.status === 404) {
          return undefined;
        }

        if (!response.ok) {
          const error = new Error(`GitHub raw ${response.status} for ${path}`);

          throw response.status >= 500 || response.status === 429 ? error : new AbortError(error);
        }

        return response.text();
      },
      { retries: FETCH.retries, minTimeout: retryDelayMs }
    );

  const read = async (path: string): Promise<string | undefined> => {
    const target = join(root, path);

    if (await exists(target)) {
      return readFile(target, 'utf8');
    }

    if (await exists(`${target}${FETCH.notFoundMarker}`)) {
      return undefined;
    }

    const body = await limit(() => download(path));

    await mkdir(dirname(target), { recursive: true });
    await (body === undefined ? writeFile(`${target}${FETCH.notFoundMarker}`, '') : writeFile(target, body));

    return body;
  };

  return { revision: { owner: source.owner, repo: source.repo, ref: ref ?? source.ref, ...commit }, read };
};

export const createGithubReader = async ({ sourceId, ...input }: CreateGithubReaderInput): Promise<SourceReader> => {
  const { revision, read } = await createRepoReader({ source: GAME_DATA_SOURCES[sourceId], ...input });

  return { revision: { sourceId, ...revision }, read };
};
