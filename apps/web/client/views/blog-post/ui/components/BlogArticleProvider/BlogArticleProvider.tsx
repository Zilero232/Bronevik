'use client';

import type { BlogArticleProviderProps } from './BlogArticleProvider.types';

import { BlogArticleContext } from '../../../model/context';

export const BlogArticleProvider = ({ article, children }: BlogArticleProviderProps) => (
  <BlogArticleContext value={article}>{children}</BlogArticleContext>
);
