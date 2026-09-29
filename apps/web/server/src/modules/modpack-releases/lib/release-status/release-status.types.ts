import type { ModpackReleaseIndex } from '@otmetki/schemas';

export type DownloadSizes = {
  modpack: number | null;
  manager: number | null;
};

export type ReleaseStatusInput = {
  index: ModpackReleaseIndex;
  sizes: DownloadSizes;
};
