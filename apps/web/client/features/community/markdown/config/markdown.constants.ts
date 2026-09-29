import type { Options } from 'react-markdown';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const MARKDOWN = {
  remarkPlugins: [remarkGfm],
  externalRel: 'noopener noreferrer nofollow',
  externalTarget: '_blank'
} as const;

export const MARKDOWN_REHYPE_PLUGINS = {
  default: [rehypeSanitize],
  article: [rehypeSanitize, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
} satisfies Record<string, NonNullable<Options['rehypePlugins']>>;
