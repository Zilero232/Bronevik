'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLestaNotice } from '@/entities/app/lesta-notice';
import { Button } from '@/ui-kit';

import type { LestaIdLinkProps } from '../LestaIdLink';

import { LestaIdLink } from '../LestaIdLink';

import s from './LestaIdAction.module.scss';

export const LestaIdAction = ({ href, label, size = 'md', variant = 'primary', block = false, className }: LestaIdLinkProps) => {
  const t = useTranslations('auth');
  const isNotConnected = useLestaNotice();

  if (!isNotConnected) {
    return <LestaIdLink block={block} className={className} href={href} label={label} size={size} variant={variant} />;
  }

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
};
