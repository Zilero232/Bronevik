'use client';

import { useTranslations } from 'next-intl';

import { BlogPostCard } from '@/entities/blog/post';
import { SectionHeader } from '@/ui-kit';

import { useArticle } from '../../../model/context';

import s from './RelatedPosts.module.scss';

export const RelatedPosts = () => {
  const t = useTranslations('blog.article');
  const { related } = useArticle();

  return related.length > 0 ? (
    <section className={s.root}>
      <SectionHeader title={t('related')} />
      <ul className={s.grid}>
        {related.map((post) => (
          <li key={post.id} className={s.cell}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  ) : null;
};
