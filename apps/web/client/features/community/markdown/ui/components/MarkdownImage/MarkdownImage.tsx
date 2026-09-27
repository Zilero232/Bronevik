import { ImageIcon } from 'lucide-react';

import type { MarkdownImageProps } from './MarkdownImage.types';

import { imageSource, markdownLinkAttributes } from '../../../lib/markdown-link';

import s from './MarkdownImage.module.scss';

export const MarkdownImage = ({ src, alt }: MarkdownImageProps) => (
  <a className={s.root} {...markdownLinkAttributes(imageSource(src))}>
    <ImageIcon aria-hidden size={14} />
    {alt || imageSource(src)}
  </a>
);
