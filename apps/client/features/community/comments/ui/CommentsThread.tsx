'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { CommentsThreadProps } from './CommentsThread.types';

import { COMMENTS_THREAD } from '../config';
import { useCommentsThread } from '../model/hooks';
import { CommentComposer, CommentItem, CommentsThreadProvider } from './components';

import s from './CommentsThread.module.scss';

export const CommentsThread = ({ target, targetId, className }: CommentsThreadProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('community.comments');
  const titleId = useId();
  const { context, nodes, count, isPending, isError, isRetrying, retry } = useCommentsThread({ target, targetId });

  return (
    <CommentsThreadProvider value={context}>
      <Card aria-labelledby={titleId} className={className} padding='none'>
        <CardHeader meta={count > 0 ? t('count', { count }) : undefined} title={<span id={titleId}>{t('title')}</span>} />
        <div className={s.body}>
          {context.isSignedIn ? (
            <CommentComposer />
          ) : (
            <p className={s.signIn}>
              <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={loginHref}>
                <LogIn size={14} />
                {t('signIn')}
              </Link>
              <span>{t('signInHint')}</span>
            </p>
          )}
          {match({ isPending, isError, isEmpty: nodes.length === 0 })
            .with({ isPending: true }, () => (
              <div aria-busy className={s.list}>
                <Skeleton count={COMMENTS_THREAD.skeletonRows} height={COMMENTS_THREAD.skeletonHeight} shape='block' />
              </div>
            ))
            .with({ isError: true }, () => (
              <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
            ))
            .with({ isEmpty: true }, () => <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />)
            .otherwise(() => (
              <div className={s.list}>
                {nodes.map((node) => (
                  <CommentItem key={node.comment.id} comment={node.comment} replies={node.replies} />
                ))}
              </div>
            ))}
        </div>
      </Card>
    </CommentsThreadProvider>
  );
};
