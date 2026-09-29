import { ShieldCheck } from 'lucide-react';

import { buttonVariants } from '@/ui-kit';

import type { LestaIdLinkProps } from './LestaIdLink.types';

import s from './LestaIdLink.module.scss';

export const LestaIdLink = ({ href, label, size = 'md', variant = 'primary', block = false, className }: LestaIdLinkProps) => (
  <a aria-disabled={!href} className={buttonVariants({ variant, size, block, className })} href={href}>
    <span aria-hidden className={s.mark}>
      <ShieldCheck size={14} />
    </span>
    {label}
  </a>
);
