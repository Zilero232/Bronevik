import { getModpackChangelog, getModpackReleasesStatus } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { ModpackChangelogQueryInput, ModpackReleaseQueryInput } from './modpack-release.types';

export const getModpackStatus = ({ signal }: ModpackReleaseQueryInput = {}) => fromSdk(() => getModpackReleasesStatus({ signal }));

export const getModpackReleaseNotes = ({ limit, signal }: ModpackChangelogQueryInput) =>
  fromSdk(() => getModpackChangelog({ query: { limit }, signal }));
