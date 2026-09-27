'use client';

import { useTranslations } from 'next-intl';

import { Avatar, Button, RelativeTime } from '@/ui-kit';

import type { CommentItemProps } from './CommentItem.types';

import { useCommentItem } from '../../../model/hooks';
import { CommentComposer } from '../CommentComposer';

import s from './CommentItem.module.scss';

export const CommentItem = ({ comment, isReply, replies = [] }: CommentItemProps) => {
  const t = useTranslations('community.comments');
  const { isOwn, isDeleted, canReply, isReplying, toggleReply, closeReply, remove, isRemoving } = useCommentItem({ comment, isReply });

  return (
    <article className={s.root} data-reply={comment.parentId !== null}>
      <header className={s.head}>
        <Avatar name={comment.author.name} size='sm' src={comment.author.image ?? undefined} />
        <span className={s.author}>{comment.author.name}</span>
        <RelativeTime className={s.time} value={comment.createdAt} />
      </header>
      {isDeleted ? <p className={s.deleted}>{t('deleted')}</p> : <p className={s.body}>{comment.body}</p>}
      {!isDeleted && (canReply || isOwn) && (
        <div className={s.actions}>
          {canReply && (
            <Button aria-expanded={isReplying} size='sm' variant='ghost' onClick={toggleReply}>
              {t('reply')}
            </Button>
          )}
          {isOwn && (
            <Button disabled={isRemoving} size='sm' variant='ghost' onClick={remove}>
              {t('delete')}
            </Button>
          )}
        </div>
      )}
      {isReplying && <CommentComposer parentId={comment.id} onCancel={closeReply} onDone={closeReply} />}
      {replies.length > 0 && (
        <div className={s.replies}>
          {replies.map((reply) => (
            <CommentItem isReply key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </article>
  );
};
