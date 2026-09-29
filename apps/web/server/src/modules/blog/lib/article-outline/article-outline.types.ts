import type { TocEntry } from '@stefanprobst/rehype-extract-toc';

import type { BlogTocItem } from '../../blog.types';

export type ArticleOutline = {
  toc: BlogTocItem[];
  readingMinutes: number;
};

export type { TocEntry };
