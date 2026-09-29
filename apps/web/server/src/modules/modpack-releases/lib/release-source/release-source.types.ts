import type { ModpackReleaseIndex } from '@otmetki/schemas';
import type { z } from 'zod';

import type { managerReleaseManifestSchema, modpackReleaseManifestSchema } from './release-source.schemas';

export type ModpackReleaseManifest = z.infer<typeof modpackReleaseManifestSchema>;

export type ManagerReleaseManifest = z.infer<typeof managerReleaseManifestSchema>;

export type IsPublishedInput = {
  index: ModpackReleaseIndex;
  version: string;
};

export type ReleaseNeedsInput = {
  index: ModpackReleaseIndex;
  modpackVersion: string;
  managerVersion: string;
};

export type ReleaseNeeds = {
  modpack: boolean;
  manager: boolean;
};
