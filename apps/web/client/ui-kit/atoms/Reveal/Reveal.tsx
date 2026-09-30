'use client';

import { clsx } from 'clsx';

import { useScrollReveal } from '@/shared/lib';

import type { RevealProps } from './Reveal.types';

import s from './Reveal.module.scss';

export const Reveal = ({ children, as: Tag = 'div', order = 0, className }: RevealProps) => {
  const ref = useScrollReveal<HTMLDivElement & HTMLLIElement>();

  return (
    <Tag ref={ref} className={clsx(s.root, className)} style={{ '--reveal-order': order }}>
      {children}
    </Tag>
  );
};
