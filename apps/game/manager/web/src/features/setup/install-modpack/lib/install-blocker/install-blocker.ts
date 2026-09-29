import type { InstallBlocker, InstallBlockerInput } from './install-blocker.types';

export const installBlocker = ({ client, source, catalog }: InstallBlockerInput): InstallBlocker | null => {
  if (client.problem !== null) {
    return 'client';
  }

  if (source !== 'release') {
    return source;
  }

  return catalog && catalog.components.length > 0 ? null : 'noCatalog';
};
