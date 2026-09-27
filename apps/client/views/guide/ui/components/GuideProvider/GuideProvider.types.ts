import type { ReactNode } from 'react';

import type { Guide } from '@/entities/guide/guide';

export type GuideProviderProps = {
  guide: Guide;
  children: ReactNode;
};
