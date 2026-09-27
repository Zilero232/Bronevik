import type { ReactNode } from 'react';

import type { UseBuildStateInput } from '../../../model/hooks';

export type BuildProviderProps = UseBuildStateInput & {
  children: ReactNode;
};
