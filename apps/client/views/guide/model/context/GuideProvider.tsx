'use client';

import type { GuideProviderProps } from './GuideProvider.types';

import { GuideContext } from './guide-context';

export const GuideProvider = ({ guide, children }: GuideProviderProps) => <GuideContext value={guide}>{children}</GuideContext>;
