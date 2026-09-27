import type { ReactNode } from 'react';

import type { StreamerContextValue } from './streamer-context.types';

export type StreamerProviderProps = Pick<StreamerContextValue, 'profile'> & {
  children: ReactNode;
};
