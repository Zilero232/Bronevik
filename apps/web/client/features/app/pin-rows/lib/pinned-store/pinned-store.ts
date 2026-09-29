import type { PinScope } from '../pinned-ids';
import type { TogglePinnedInput } from './pinned-store.types';

import { PIN_ROWS, PIN_SCOPES } from '../../config';
import { readPinnedIds, togglePinnedId } from '../pinned-ids';

const listeners = new Set<() => void>();
const snapshots = new Map<PinScope, { raw: string | null; ids: string[] }>();

const parseStored = (raw: string | null): unknown => {
  try {
    return raw === null ? [] : JSON.parse(raw);
  } catch {
    return [];
  }
};

const readRaw = (scope: PinScope): string | null => {
  try {
    return window.localStorage.getItem(PIN_SCOPES[scope]);
  } catch {
    return null;
  }
};

export const readPinned = (scope: PinScope): string[] => {
  const raw = readRaw(scope);
  const cached = snapshots.get(scope);

  if (cached?.raw === raw) {
    return cached.ids;
  }

  const ids = readPinnedIds(parseStored(raw));

  snapshots.set(scope, { raw, ids });

  return ids;
};

export const subscribePinned = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

export const togglePinned = ({ scope, id }: TogglePinnedInput) => {
  const next = togglePinnedId({ ids: readPinned(scope), id, limit: PIN_ROWS.limit });

  try {
    window.localStorage.setItem(PIN_SCOPES[scope], JSON.stringify(next));
  } catch {
    return;
  }

  listeners.forEach((listener) => listener());
};
