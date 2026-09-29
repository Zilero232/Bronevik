'use client';

import { useQuery } from '@tanstack/react-query';

import { getBlogArticle } from '@/entities/blog/post';
import { QUERY_KEYS } from '@/shared/constants';

import { BLOG_POST_PAGE } from '../../../config';

export const useBlogArticle = (slug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.blog.article(slug),
    queryFn: ({ signal }) => getBlogArticle({ slug, signal }),
    staleTime: BLOG_POST_PAGE.staleMs
  });
