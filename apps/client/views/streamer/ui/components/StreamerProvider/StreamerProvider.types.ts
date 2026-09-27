import type { ReactNode } from 'react';

import type { StreamerContextValue } from '../../../model/context';

export type StreamerProviderProps = Pick<StreamerContextValue, 'profile'> & {
  children: ReactNode;
};
