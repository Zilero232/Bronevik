'use client';

import { ShieldCheck } from 'lucide-react';

import { lestaStartUrl } from '@/shared/api/auth';
import { useHydrated } from '@/shared/lib';
import { buttonVariants } from '@/ui-kit';

import type { LestaIdButtonProps } from './LestaIdButton.types';

import s from './LestaIdButton.module.scss';

export const LestaIdButton = ({ callbackPath, label, size = 'md', variant = 'primary', block = false, className }: LestaIdButtonProps) => {
  const isHydrated = useHydrated();

  const href = isHydrated ? lestaStartUrl({ callbackURL: new URL(callbackPath, window.location.origin).toString() }) : undefined;

  return (
    <a aria-disabled={!href} className={buttonVariants({ variant, size, block, className })} href={href}>
      <span aria-hidden className={s.mark}>
        <ShieldCheck size={size === 'lg' ? 20 : 16} />
      </span>
      {label}
    </a>
  );
};
