'use client';

import { useSyncExternalStore } from 'react';

import type { PinnedView } from '../../../lib/pinned-view';
import type { UsePinnedRowsInput } from './use-pinned-rows.types';

import { readPinned, subscribePinned } from '../../../lib/pinned-store';
import { pinnedView } from '../../../lib/pinned-view';

export const usePinnedRows = ({ scope, isPinnedOnly }: UsePinnedRowsInput): PinnedView => {
  const pinnedIds = useSyncExternalStore(
    subscribePinned,
    () => readPinned(scope),
    () => null
  );

  return pinnedView({ isPinnedOnly, pinnedIds });
};
