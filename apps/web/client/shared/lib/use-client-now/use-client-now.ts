'use client';

import { useState, useSyncExternalStore } from 'react';

import type { NowStore, UseClientNowInput } from './use-client-now.types';

const readOnServer = () => null;

const createNowStore = (updateInterval?: number): NowStore => {
  let now: Date | null = null;

  return {
    read: () => (now ??= new Date()),
    subscribe: (notify) => {
      if (!updateInterval) {
        return () => undefined;
      }

      const id = setInterval(() => {
        now = new Date();
        notify();
      }, updateInterval);

      return () => clearInterval(id);
    }
  };
};

export const useClientNow = ({ updateInterval }: UseClientNowInput = {}): Date | null => {
  const [store] = useState(() => createNowStore(updateInterval));

  return useSyncExternalStore(store.subscribe, store.read, readOnServer);
};
