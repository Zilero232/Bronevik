import { resolve } from 'node:path';

import { MODPACK_RELEASES_SOURCE, MODPACK_RELEASES_TOKENS } from '../config';

export const releaseIndexPathProvider = {
  provide: MODPACK_RELEASES_TOKENS.indexPath,
  useFactory: () => resolve(MODPACK_RELEASES_SOURCE.indexPath)
};
