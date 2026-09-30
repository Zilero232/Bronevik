'use client';

import { useSyncExternalStore } from 'react';

import type { StoredStore } from '../stored-store';

const onServer = () => null;

export const useStoredStore = <T>(store: StoredStore<T>): T | null => useSyncExternalStore(store.subscribe, store.read, onServer);
