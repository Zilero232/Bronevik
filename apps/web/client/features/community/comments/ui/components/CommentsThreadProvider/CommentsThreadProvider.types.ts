import type { ReactNode } from 'react';

import type { CommentsThreadContextValue } from '../../../model/context';

export type CommentsThreadProviderProps = {
  value: CommentsThreadContextValue;
  children: ReactNode;
};
