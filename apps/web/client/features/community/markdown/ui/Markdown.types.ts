import type { MARKDOWN_PLUGINS } from '../config';

type MarkdownVariant = keyof typeof MARKDOWN_PLUGINS.rehype;

export type MarkdownProps = {
  children: string;
  variant?: MarkdownVariant;
  className?: string;
};
