'use client';

import { createContext, use } from 'react';

import type { LestaNoticeContextValue } from './lesta-notice-context.types';

export const LestaNoticeContext = createContext<LestaNoticeContextValue | null>(null);

export const useLestaNotice = () => {
  const isShown = use(LestaNoticeContext);

  return isShown ? use(isShown) : false;
};
