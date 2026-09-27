'use client';

import { createContext, use } from 'react';

import type { CommentsThreadContextValue } from './comments-thread-context.types';

export const CommentsThreadContext = createContext<CommentsThreadContextValue | null>(null);

export const useCommentsThreadContext = () => {
  const context = use(CommentsThreadContext);

  if (!context) {
    throw new Error('useCommentsThreadContext must be used inside CommentsThreadProvider');
  }

  return context;
};
