import Image from 'next/image';

import type { MarkdownFigureProps } from './MarkdownFigure.types';

import { imageSource } from '../../../lib/markdown-link';

import s from './MarkdownFigure.module.scss';

export const MarkdownFigure = ({ src, alt, title }: MarkdownFigureProps) => {
  const source = imageSource(src);

  return source ? (
    <Image
      unoptimized
      alt={alt ?? ''}
      className={s.root}
      height={0}
      loading='lazy'
      referrerPolicy='no-referrer'
      sizes='100vw'
      src={source}
      title={title}
      width={0}
    />
  ) : null;
};
