import type { ToggledTagInput } from './blog-filters.types';

import { BLOG_PAGE } from '../../config';

export const blogRssHref = (apiUrl: string): string => new URL(BLOG_PAGE.rssPath, apiUrl).href;

export const toggledTag = ({ current, next }: ToggledTagInput): string | null => next.find((tag) => tag !== current) ?? null;
