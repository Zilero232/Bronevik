'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { CommentsThreadProps } from './CommentsThread.types';

import { COMMENTS_THREAD } from '../config';
import { useCommentsThread } from '../model/hooks';
import { CommentComposer, CommentItem } from './components';

import s from './CommentsThread.module.scss';

export const CommentsThread = ({ target, targetId, className }: CommentsThreadProps) => {
  const t = useTranslations('community.comments');
  const titleId = useId();
  const { nodes, count, viewerId, isSignedIn, isPending, isError, isRetrying, retry } = useCommentsThread({ target, targetId });

  return (
    <Card aria-labelledby={titleId} className={className} padding='none'>
      <CardHeader meta={count > 0 ? t('count', { count }) : undefined} title={<span id={titleId}>{t('title')}</span>} />
      <div className={s.body}>
        {isSignedIn ? (
          <CommentComposer thread={{ target, targetId }} />
        ) : (
          <p className={s.signIn}>
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.auth.login}>
              <LogIn size={14} />
              {t('signIn')}
            </Link>
            <span>{t('signInHint')}</span>
          </p>
        )}
        {match({ isPending, isError, isEmpty: nodes.length === 0 })
          .with({ isPending: true }, () => (
            <div aria-busy className={s.list}>
              {COMMENTS_THREAD.skeletonRows.map((row) => (
                <Skeleton key={row} height={COMMENTS_THREAD.skeletonHeight} shape='block' />
              ))}
            </div>
          ))
          .with({ isError: true }, () => (
            <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
          ))
          .with({ isEmpty: true }, () => <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />)
          .otherwise(() => (
            <div className={s.list}>
              {nodes.map((node) => (
                <CommentItem
                  key={node.comment.id}
                  canReply={isSignedIn}
                  comment={node.comment}
                  replies={node.replies}
                  thread={{ target, targetId }}
                  viewerId={viewerId}
                />
              ))}
            </div>
          ))}
      </div>
    </Card>
  );
};
