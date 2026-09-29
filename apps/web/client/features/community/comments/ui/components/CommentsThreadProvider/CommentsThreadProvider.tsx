'use client';

import type { CommentsThreadProviderProps } from './CommentsThreadProvider.types';

import { CommentsThreadContext } from '../../../model/context';

export const CommentsThreadProvider = ({ value, children }: CommentsThreadProviderProps) => (
  <CommentsThreadContext value={value}>{children}</CommentsThreadContext>
);
