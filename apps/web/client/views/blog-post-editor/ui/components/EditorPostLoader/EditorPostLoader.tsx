'use client';

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import type { EditorPostLoaderProps } from './EditorPostLoader.types';

import { BLOG_POST_FORM } from '../../../config';
import { useEditorPost } from '../../../model/hooks';
import { BlogPostForm } from '../BlogPostForm';

import s from './EditorPostLoader.module.scss';

export const EditorPostLoader = ({ id }: EditorPostLoaderProps) => {
  const t = useTranslations('blog.editor.form');
  const { post, isPostPending, isNotFound, isError, isRetrying, retry } = useEditorPost(id);

  return match({ isNotFound, isError, isPostPending })
    .with({ isNotFound: true }, () => notFound())
    .with({ isError: true }, () => (
      <ErrorState description={t('loadErrorDescription')} isRetrying={isRetrying} title={t('loadErrorTitle')} onRetry={retry} />
    ))
    .with({ isPostPending: true }, () => (
      <div aria-busy className={s.skeleton}>
        {BLOG_POST_FORM.skeletonHeights.map((height) => (
          <Skeleton key={height} height={height} shape='block' />
        ))}
      </div>
    ))
    .otherwise(() => <BlogPostForm key={post?.id ?? 'new'} post={post} />);
};
