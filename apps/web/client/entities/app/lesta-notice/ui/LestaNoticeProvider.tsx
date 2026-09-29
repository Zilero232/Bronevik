'use client';

import type { LestaNoticeProviderProps } from './LestaNoticeProvider.types';

import { LestaNoticeContext } from '../model/context';

export const LestaNoticeProvider = ({ isShown, children }: LestaNoticeProviderProps) => (
  <LestaNoticeContext value={isShown}>{children}</LestaNoticeContext>
);
