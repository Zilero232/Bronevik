import type { UseCommentFormInput } from '../../../model/hooks';

export type CommentComposerProps = UseCommentFormInput & {
  onCancel?: () => void;
};
