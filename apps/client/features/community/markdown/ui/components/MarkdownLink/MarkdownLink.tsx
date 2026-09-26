import type { MarkdownLinkProps } from './MarkdownLink.types';

import { markdownLinkAttributes } from '../../../lib/markdown-link';

export const MarkdownLink = ({ href, title, children }: MarkdownLinkProps) => (
  <a title={title} {...markdownLinkAttributes(href)}>
    {children}
  </a>
);
