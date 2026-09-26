'use client';

import { clsx } from 'clsx';

import { useSectionReveal } from '@/shared/lib';

import type { RevealProps } from './Reveal.types';

import s from './Reveal.module.scss';

export const Reveal = ({ children, className }: RevealProps) => {
  const ref = useSectionReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={clsx(s.root, className)}>
      {children}
    </div>
  );
};
