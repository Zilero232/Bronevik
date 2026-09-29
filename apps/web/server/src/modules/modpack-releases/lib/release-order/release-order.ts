import semver from 'semver';

import type { Versioned } from './release-order.types';

export const newestFirst = <T extends Versioned>(releases: readonly T[]): T[] =>
  releases.toSorted((left, right) => semver.rcompare(left.version, right.version));
