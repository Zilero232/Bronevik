'use client';

import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, Kbd } from '@/ui-kit';

import type { CommandPaletteTriggerProps } from './CommandPaletteTrigger.types';

import { useCommandPalette } from '../model/context';

import s from './CommandPaletteTrigger.module.scss';

export const CommandPaletteTrigger = ({ variant = 'bar', className }: CommandPaletteTriggerProps) => {
  const t = useTranslations('search');
  const { setOpen } = useCommandPalette();

  if (variant === 'icon') {
    return (
      <IconButton aria-label={t('open')} className={className} onClick={() => setOpen(true)}>
        <Search size={18} />
      </IconButton>
    );
  }

  return (
    <button className={clsx(s.root, s[variant], className)} type='button' onClick={() => setOpen(true)}>
      <Search aria-hidden className={s.icon} size={variant === 'hero' ? 22 : 16} />
      <span className={s.label}>{variant === 'hero' ? t('heroPlaceholder') : t('trigger')}</span>
      <span className={s.keys}>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
};
