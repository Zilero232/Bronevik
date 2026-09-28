'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);

  return () => window.removeEventListener('hashchange', onChange);
};

const onClient = () => window.location.hash.slice(1);

const onServer = () => null;

export const useLocationHash = (): string | null => useSyncExternalStore(subscribe, onClient, onServer);
