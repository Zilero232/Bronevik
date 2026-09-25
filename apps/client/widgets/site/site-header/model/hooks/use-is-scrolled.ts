'use client';

import { useSyncExternalStore } from 'react';

const THRESHOLD = 8;

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });

  return () => window.removeEventListener('scroll', onChange);
};

const onClient = () => window.scrollY > THRESHOLD;

const onServer = () => false;

export const useIsScrolled = () => useSyncExternalStore(subscribe, onClient, onServer);
