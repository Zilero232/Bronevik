import type { TocEntry } from '@stefanprobst/rehype-extract-toc';

export type ArticleHeading = {
  id: string;
  text: string;
  depth: number;
};

export type ArticleOutline = {
  toc: ArticleHeading[];
  readingMinutes: number;
};

export type { TocEntry };
