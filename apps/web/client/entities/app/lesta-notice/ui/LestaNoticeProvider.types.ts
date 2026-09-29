import type { ReactNode } from 'react';

import type { LestaNoticeContextValue } from '../model/context';

export type LestaNoticeProviderProps = {
  isShown: LestaNoticeContextValue;
  children: ReactNode;
};
