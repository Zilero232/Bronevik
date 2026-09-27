'use client';

import { createContext, use } from 'react';

import type { StreamerContextValue } from './streamer-context.types';

export const StreamerContext = createContext<StreamerContextValue | null>(null);

export const useStreamer = () => {
  const context = use(StreamerContext);

  if (!context) {
    throw new Error('useStreamer must be used inside StreamerProvider');
  }

  return context;
};
