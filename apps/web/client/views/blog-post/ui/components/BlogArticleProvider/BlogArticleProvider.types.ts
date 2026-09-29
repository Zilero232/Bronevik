import type { ReactNode } from 'react';

import type { BlogArticle } from '@/entities/blog/post';

export type BlogArticleProviderProps = {
  article: BlogArticle;
  children: ReactNode;
};
