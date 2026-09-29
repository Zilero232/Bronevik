'use client';

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { ErrorState, SkeletonStack } from '@/ui-kit';

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
    .with({ isPostPending: true }, () => <SkeletonStack className={s.skeleton} heights={BLOG_POST_FORM.skeletonHeights} />)
    .otherwise(() => <BlogPostForm key={post?.id ?? 'new'} post={post} />);
};
