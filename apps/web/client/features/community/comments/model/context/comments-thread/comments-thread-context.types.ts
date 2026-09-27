import type { ReactNode } from 'react';

import type { CommentThreadTarget } from '../../../lib/comment-form';

export type CommentsThreadContextValue = {
  thread: CommentThreadTarget;
  viewerId: string | null;
  isSignedIn: boolean;
};

export type CommentsThreadProviderProps = {
  value: CommentsThreadContextValue;
  children: ReactNode;
};
