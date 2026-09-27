import type { ReactNode } from 'react';

import type { TreeContextValue } from '../../../model/context';

export type TreeProviderProps = TreeContextValue & {
  children: ReactNode;
};
