'use client';

import { useQuery } from '@tanstack/react-query';

import { getBlogTags } from '@/entities/blog/post';
import { QUERY_KEYS } from '@/shared/constants';

import { BLOG_PAGE } from '../../../config';

export const useBlogTags = () => {
  const { data } = useQuery({ queryKey: QUERY_KEYS.blog.tags, queryFn: ({ signal }) => getBlogTags(signal), staleTime: BLOG_PAGE.staleMs });

  return (data ?? []).map(({ tag, count }) => ({ value: tag, label: `#${tag}`, title: String(count) }));
};
