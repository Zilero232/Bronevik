import type { ModpackReleasesStatus } from '@otmetki/schemas';

import semver from 'semver';

import type { ReleaseStatusInput } from './release-status.types';

export const releaseStatus = ({ index, sizes }: ReleaseStatusInput): ModpackReleasesStatus => {
  const [release] = index.releases.toSorted((left, right) => semver.rcompare(left.version, right.version));
  const manager = index.manager;

  return {
    modpack: release && sizes.modpack !== null ? { version: release.version, publishedAt: release.publishedAt, size: sizes.modpack } : null,
    manager: manager && sizes.manager !== null ? { version: manager.version, publishedAt: manager.publishedAt, size: sizes.manager } : null
  };
};
