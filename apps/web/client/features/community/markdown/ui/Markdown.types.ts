import type { MARKDOWN_REHYPE_PLUGINS } from '../config';

export type MarkdownVariant = keyof typeof MARKDOWN_REHYPE_PLUGINS;

export type MarkdownProps = {
  children: string;
  variant?: MarkdownVariant;
  className?: string;
};
