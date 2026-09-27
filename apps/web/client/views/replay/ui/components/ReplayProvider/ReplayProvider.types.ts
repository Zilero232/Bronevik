import type { ReactNode } from 'react';

import type { Replay } from '@/entities/replay/replay';

export type ReplayProviderProps = {
  replay: Replay;
  children: ReactNode;
};
