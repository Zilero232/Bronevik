import { useTranslations } from 'next-intl';

import type { BlogCategoryChipProps } from './BlogCategoryChip.types';

import { BLOG_CATEGORY_ICON } from '../../config';

import s from './BlogCategoryChip.module.scss';

export const BlogCategoryChip = ({ category }: BlogCategoryChipProps) => {
  const t = useTranslations('blog.categories');
  const Icon = BLOG_CATEGORY_ICON[category];

  return (
    <span className={s.root}>
      <Icon aria-hidden size={12} />
      {t(category)}
    </span>
  );
};
