import type { ModpackReleaseIndex } from '@otmetki/schemas';
import type { z } from 'zod';

import type { modpackReleaseManifestSchema } from './release-source.schemas';

export type ModpackReleaseManifest = z.infer<typeof modpackReleaseManifestSchema>;

export type IsPublishedInput = {
  index: ModpackReleaseIndex;
  version: string;
};
