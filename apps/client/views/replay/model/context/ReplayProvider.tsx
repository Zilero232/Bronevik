'use client';

import type { ReplayProviderProps } from './ReplayProvider.types';

import { ReplayContext } from './replay-context';

export const ReplayProvider = ({ replay, children }: ReplayProviderProps) => <ReplayContext value={replay}>{children}</ReplayContext>;
