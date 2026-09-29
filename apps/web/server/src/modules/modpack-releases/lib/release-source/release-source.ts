import semver from 'semver';

import type { IsPublishedInput, ReleaseNeeds, ReleaseNeedsInput } from './release-source.types';

export const isPublished = ({ index, version }: IsPublishedInput): boolean => index.releases.some((release) => release.version === version);

export const releaseNeeds = ({ index, modpackVersion, managerVersion }: ReleaseNeedsInput): ReleaseNeeds => ({
  modpack: !isPublished({ index, version: modpackVersion }),
  manager: !index.manager || semver.gt(managerVersion, index.manager.version)
});
