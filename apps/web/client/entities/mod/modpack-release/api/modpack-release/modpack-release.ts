import { getModpackReleasesStatus } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { ModpackReleaseQueryInput } from './modpack-release.types';

export const getModpackStatus = ({ signal }: ModpackReleaseQueryInput = {}) => fromSdk(() => getModpackReleasesStatus({ signal }));
