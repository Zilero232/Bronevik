import type { ModpackManagerUpdate } from '@otmetki/schemas';

import semver from 'semver';

import type { SelectManagerUpdateInput } from './manager-update.types';

export const selectManagerUpdate = ({ index, query }: SelectManagerUpdateInput): ModpackManagerUpdate | null => {
  const manager = index.manager;
  const platform = manager?.platforms[`${query.target}-${query.arch}`];

  if (!manager || !platform || !semver.gt(manager.version, query.current)) {
    return null;
  }

  return {
    version: manager.version,
    notes: manager.notes,
    pub_date: manager.publishedAt,
    url: platform.url,
    signature: platform.signature
  };
};
