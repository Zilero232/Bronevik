'use client';

import type { CommentsThreadProviderProps } from '../../../model/context';

import { CommentsThreadContext } from '../../../model/context';

export const CommentsThreadProvider = ({ value, children }: CommentsThreadProviderProps) => (
  <CommentsThreadContext value={value}>{children}</CommentsThreadContext>
);
