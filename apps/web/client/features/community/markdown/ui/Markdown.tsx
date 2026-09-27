import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';

import type { MarkdownProps } from './Markdown.types';

import { MARKDOWN } from '../config';
import { MarkdownImage, MarkdownLink } from './components';

import s from './Markdown.module.scss';

export const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={clsx(s.root, className)}>
    <ReactMarkdown skipHtml components={{ a: MarkdownLink, img: MarkdownImage }} remarkPlugins={[...MARKDOWN.remarkPlugins]}>
      {children}
    </ReactMarkdown>
  </div>
);
