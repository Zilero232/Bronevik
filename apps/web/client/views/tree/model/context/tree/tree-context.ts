'use client';

import { createContext, use } from 'react';

import type { TreeContextValue } from './tree-context.types';

export const TreeContext = createContext<TreeContextValue | null>(null);

export const useTree = () => {
  const context = use(TreeContext);

  if (!context) {
    throw new Error('useTree must be used inside TreeProvider');
  }

  return context;
};
