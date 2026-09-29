'use client';

import { useTranslations } from 'next-intl';

import { useArticle } from '../../../model/context';

import s from './ArticleToc.module.scss';

export const ArticleToc = () => {
  const t = useTranslations('blog.article');
  const { post } = useArticle();

  return post.toc.length > 0 ? (
    <nav aria-label={t('toc')} className={s.root}>
      <p className={s.title}>{t('toc')}</p>
      <ol className={s.list}>
        {post.toc.map((item) => (
          <li key={item.id} className={s.item} data-depth={item.depth}>
            <a className={s.link} href={`#${item.id}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  ) : null;
};
