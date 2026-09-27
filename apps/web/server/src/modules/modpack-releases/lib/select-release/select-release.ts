import type { ModpackLatestRelease } from '@otmetki/schemas';

import semver from 'semver';

import type { SelectReleaseInput } from './select-release.types';

import { matchesGame } from '../game-match';

export const selectRelease = ({ index, game }: SelectReleaseInput): ModpackLatestRelease => {
  const release =
    index.releases
      .filter((candidate) => candidate.games.some((pattern) => matchesGame({ pattern, game })))
      .toSorted((left, right) => semver.rcompare(left.version, right.version))
      .at(0) ?? null;

  return { game, status: release ? 'compatible' : 'waiting', release };
};
