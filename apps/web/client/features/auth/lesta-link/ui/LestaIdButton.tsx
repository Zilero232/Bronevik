'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LESTA_NOTICE } from '@/shared/config';
import { Button, buttonVariants } from '@/ui-kit';

import type { LestaIdButtonProps } from './LestaIdButton.types';

import { useLestaStartUrl } from '../model/hooks';

import s from './LestaIdButton.module.scss';

export const LestaIdButton = ({ callbackPath, errorPath, label, size = 'md', variant = 'primary', block = false, className }: LestaIdButtonProps) => {
  const t = useTranslations('auth');
  const href = useLestaStartUrl({ callbackPath, errorPath });

  if (LESTA_NOTICE.isEnabled) {
    return (
      <span className={s.pending}>
        <Button disabled block={block} className={className} size={size} variant={variant}>
          <span aria-hidden className={s.mark}>
            <ShieldCheck size={14} />
          </span>
          {label}
        </Button>
        <span className={s.note}>{t('lestaNotConnected')}</span>
      </span>
    );
  }

  return (
    <a aria-disabled={!href} className={buttonVariants({ variant, size, block, className })} href={href}>
      <span aria-hidden className={s.mark}>
        <ShieldCheck size={14} />
      </span>
      {label}
    </a>
  );
};
