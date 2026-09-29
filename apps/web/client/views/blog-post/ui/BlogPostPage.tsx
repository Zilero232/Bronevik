'use client';

import { useTranslations } from 'next-intl';

import { Markdown } from '@/features/community/markdown';
import { Card, Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { BlogPostPageProps } from './BlogPostPage.types';

import { BLOG_POST_PAGE } from '../config';
import { useBlogArticle } from '../model/hooks';
import { ArticleHero, ArticleShare, ArticleTags, ArticleToc, BlogArticleProvider, RelatedPosts } from './components';

import s from './BlogPostPage.module.scss';

export const BlogPostPage = ({ slug }: BlogPostPageProps) => {
  const t = useTranslations('blog.article');
  const query = useBlogArticle(slug);

  return (
    <div className={s.root}>
      <ResourceGate
        skeleton={
          <div aria-busy className={s.skeleton}>
            {BLOG_POST_PAGE.skeletonHeights.map((height) => (
              <Skeleton key={height} height={height} shape='block' />
            ))}
          </div>
        }
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        query={query}
      >
        {(article) => (
          <BlogArticleProvider article={article}>
            <ArticleHero />
            <div className={s.layout}>
              <Card className={s.body} padding='lg'>
                <Markdown variant='article'>{article.post.body}</Markdown>
                <ArticleTags />
              </Card>
              <aside className={s.aside}>
                <ArticleToc />
                <ArticleShare />
              </aside>
            </div>
            <RelatedPosts />
          </BlogArticleProvider>
        )}
      </ResourceGate>
    </div>
  );
};
