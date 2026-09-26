import type { Comment, CommentList, CommentListInput, CreateComment } from './comments.types';

import { commentsControllerCreate, commentsControllerList, commentsControllerRemove } from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const listComments = ({ target, targetId, signal }: CommentListInput): Promise<CommentList> =>
  fromSdk(() => commentsControllerList({ query: { target, targetId }, signal }));

export const createComment = (body: CreateComment): Promise<Comment> => fromSdk(() => commentsControllerCreate({ ...SESSION_REQUEST, body }));

export const removeComment = async (id: string): Promise<void> => {
  await fromSdk(() => commentsControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
