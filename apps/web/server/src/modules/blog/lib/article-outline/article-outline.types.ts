import type { BlogTocItem } from '@otmetki/schemas';
import type { TocEntry } from '@stefanprobst/rehype-extract-toc';

export type ArticleOutline = {
  toc: BlogTocItem[];
  readingMinutes: number;
};

export type { TocEntry };
