import type { ReactNode } from 'react';

import type { BoardWorkspaceInput } from '../../../model/hooks';

export type BoardWorkspaceProviderProps = BoardWorkspaceInput & {
  children: ReactNode;
};
