'use client';

import { useEffect } from 'react';

import type { UseCelebrateGainInput } from './use-celebrate-gain.types';

import { celebrate, CELEBRATE, isGain } from '../celebrate';

const readStored = (storageKey: string): number | null => {
  try {
    const raw = window.localStorage.getItem(storageKey);

    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
};

export const useCelebrateGain = ({ key, value }: UseCelebrateGainInput) => {
  useEffect(() => {
    if (key === null || typeof value !== 'number') {
      return;
    }

    const storageKey = `${CELEBRATE.storagePrefix}${key}`;

    if (isGain({ previous: readStored(storageKey), next: value })) {
      void celebrate();
    }

    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch {}
  }, [key, value]);
};
