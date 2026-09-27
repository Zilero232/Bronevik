import type { Comment } from '../../../api';
import type { UseCommentItemInput } from '../../../model/hooks';

export type CommentItemProps = UseCommentItemInput & {
  replies?: Comment[];
};
