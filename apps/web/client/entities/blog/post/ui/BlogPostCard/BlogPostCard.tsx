import { Clock } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Avatar, StoryCard } from '@/ui-kit';

import type { BlogPostCardProps } from './BlogPostCard.types';

import { BLOG_CATEGORY_ICON, BLOG_CATEGORY_TONE } from '../../config';
import { BlogCategoryChip } from '../BlogCategoryChip';

import s from './BlogPostCard.module.scss';

export const BlogPostCard = ({ post, variant = 'default', isPriority = false }: BlogPostCardProps) => {
  const t = useTranslations('blog');
  const format = useFormatter();
  const Icon = BLOG_CATEGORY_ICON[post.category];

  return (
    <StoryCard
      footer={
        post.author && (
          <span className={s.author}>
            <Avatar name={post.author.name} size='sm' src={post.author.image ?? undefined} />
            {post.author.name}
          </span>
        )
      }
      meta={
        <>
          {post.publishedAt && <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), 'date')}</time>}
          <span className={s.reading}>
            <Clock aria-hidden size={12} />
            {t('readingMinutes', { minutes: post.readingMinutes })}
          </span>
        </>
      }
      chip={<BlogCategoryChip category={post.category} />}
      cover={post.cover}
      excerpt={post.excerpt}
      glyph={<Icon />}
      href={ROUTES.blog.detail(post.slug)}
      isPriority={isPriority}
      title={post.title}
      tone={BLOG_CATEGORY_TONE[post.category]}
      variant={variant}
    />
  );
};
