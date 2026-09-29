import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';

import type { MarkdownProps } from './Markdown.types';

import { MARKDOWN_PLUGINS } from '../config';
import { MarkdownFigure, MarkdownImage, MarkdownLink } from './components';

import s from './Markdown.module.scss';

export const Markdown = ({ children, variant = 'default', className }: MarkdownProps) => (
  <div className={clsx(s.root, s[variant], className)}>
    <ReactMarkdown
      skipHtml
      components={{ a: MarkdownLink, img: variant === 'article' ? MarkdownFigure : MarkdownImage }}
      rehypePlugins={MARKDOWN_PLUGINS.rehype[variant]}
      remarkPlugins={MARKDOWN_PLUGINS.remark}
    >
      {children}
    </ReactMarkdown>
  </div>
);
