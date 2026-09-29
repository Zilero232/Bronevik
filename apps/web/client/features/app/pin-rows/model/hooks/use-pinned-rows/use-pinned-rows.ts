'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { useHydrated } from '@/shared/lib';

import type { PinScope } from '../../../lib/pinned-ids';

import { PIN_ROWS, PIN_SCOPES } from '../../../config';
import { readPinnedIds, togglePinnedId } from '../../../lib/pinned-ids';

export const usePinnedRows = (scope: PinScope) => {
  const isHydrated = useHydrated();
  const { value, set } = useLocalStorage<unknown>(PIN_SCOPES[scope]);

  const pinnedIds = isHydrated ? readPinnedIds(value) : [];

  return {
    pinnedIds,
    isPinned: (id: string) => pinnedIds.includes(id),
    onToggle: (id: string) => set(togglePinnedId({ ids: pinnedIds, id, limit: PIN_ROWS.limit }))
  };
};
