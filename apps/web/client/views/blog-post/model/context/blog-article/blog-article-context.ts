'use client';

import { createContext, use } from 'react';

import type { BlogArticle } from '@/entities/blog/post';

export const BlogArticleContext = createContext<BlogArticle | null>(null);

export const useArticle = () => {
  const context = use(BlogArticleContext);

  if (!context) {
    throw new Error('useArticle must be used inside BlogArticleProvider');
  }

  return context;
};
