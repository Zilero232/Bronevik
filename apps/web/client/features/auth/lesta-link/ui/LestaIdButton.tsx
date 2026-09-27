'use client';

import { ShieldCheck } from 'lucide-react';

import { buttonVariants } from '@/ui-kit';

import type { LestaIdButtonProps } from './LestaIdButton.types';

import { useLestaStartUrl } from '../model/hooks';

import s from './LestaIdButton.module.scss';

export const LestaIdButton = ({ callbackPath, errorPath, label, size = 'md', variant = 'primary', block = false, className }: LestaIdButtonProps) => {
  const href = useLestaStartUrl({ callbackPath, errorPath });

  return (
    <a aria-disabled={!href} className={buttonVariants({ variant, size, block, className })} href={href}>
      <span aria-hidden className={s.mark}>
        <ShieldCheck size={14} />
      </span>
      {label}
    </a>
  );
};
