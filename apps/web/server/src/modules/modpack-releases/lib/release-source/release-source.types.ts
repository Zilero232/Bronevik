import type { ModpackReleaseIndex } from '@otmetki/schemas';

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
