'use client';

import { createContext, use } from 'react';

import type { Replay } from '@/entities/replay/replay';

export const ReplayContext = createContext<Replay | null>(null);

export const useReplay = () => {
  const context = use(ReplayContext);

  if (!context) {
    throw new Error('useReplay must be used inside ReplayProvider');
  }

  return context;
};
