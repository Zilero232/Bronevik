'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { useArticle } from '../../../model/context';

import s from './ArticleTags.module.scss';

export const ArticleTags = () => {
  const t = useTranslations('blog.article');
  const { post } = useArticle();

  return post.tags.length > 0 ? (
    <ul aria-label={t('tags')} className={s.root}>
      {post.tags.map((tag) => (
        <li key={tag}>
          <Link className={s.tag} href={{ pathname: ROUTES.blog.list, query: { tag } }}>
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  ) : null;
};
