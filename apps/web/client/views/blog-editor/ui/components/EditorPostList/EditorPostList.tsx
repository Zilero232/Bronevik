'use client';

import { FilePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { BLOG_EDITOR } from '../../../config';
import { useEditorPosts } from '../../../model/hooks';
import { EditorPostRow } from './components';

import s from './EditorPostList.module.scss';

export const EditorPostList = () => {
  const t = useTranslations('blog.editor.list');
  const { query, isRemoving, onRemove } = useEditorPosts();

  return (
    <QueryState
      empty={
        <EmptyState
          action={
            <Link className={buttonVariants({ size: 'sm' })} href={ROUTES.blog.editor.create}>
              {t('create')}
            </Link>
          }
          description={t('emptyDescription')}
          icon={<FilePlus />}
          title={t('emptyTitle')}
        />
      }
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      isEmpty={(posts) => posts.length === 0}
      query={query}
      skeleton={<Skeleton count={BLOG_EDITOR.skeletons} height={72} shape='block' />}
    >
      {(posts) => (
        <ul className={s.root}>
          {posts.map((post) => (
            <li key={post.id}>
              <EditorPostRow isRemoving={isRemoving} post={post} onRemove={onRemove} />
            </li>
          ))}
        </ul>
      )}
    </QueryState>
  );
};
