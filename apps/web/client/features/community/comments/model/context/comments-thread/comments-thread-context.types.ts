import type { CommentThreadTarget } from '../../../lib/comment-form';

export type CommentsThreadContextValue = {
  thread: CommentThreadTarget;
  viewerId: string | null;
  isSignedIn: boolean;
};
