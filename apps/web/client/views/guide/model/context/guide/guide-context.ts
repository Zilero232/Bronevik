'use client';

import { createContext, use } from 'react';

import type { Guide } from '@/entities/guide/guide';

export const GuideContext = createContext<Guide | null>(null);

export const useGuide = () => {
  const context = use(GuideContext);

  if (!context) {
    throw new Error('useGuide must be used inside GuideProvider');
  }

  return context;
};
