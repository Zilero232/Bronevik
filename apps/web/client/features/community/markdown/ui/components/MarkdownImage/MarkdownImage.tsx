import { ImageIcon } from 'lucide-react';

import type { MarkdownImageProps } from './MarkdownImage.types';

import { markdownImageLink } from '../../../lib/markdown-link';

import s from './MarkdownImage.module.scss';

export const MarkdownImage = ({ src, alt }: MarkdownImageProps) => {
  const { attributes, label } = markdownImageLink({ src, alt });

  return (
    <a className={s.root} {...attributes}>
      <ImageIcon aria-hidden size={14} />
      {label}
    </a>
  );
};
