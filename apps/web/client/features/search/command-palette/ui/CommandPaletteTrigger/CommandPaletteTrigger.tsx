'use client';

import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, Kbd } from '@/ui-kit';

import type { CommandPaletteTriggerProps } from './CommandPaletteTrigger.types';

import { useCommandPaletteTrigger } from '../../model/hooks';

import s from './CommandPaletteTrigger.module.scss';

export const CommandPaletteTrigger = ({ variant = 'bar', className, onOpen }: CommandPaletteTriggerProps) => {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const open = useCommandPaletteTrigger(onOpen);

  if (variant === 'icon') {
    return (
      <IconButton aria-label={t('open')} className={className} onClick={open}>
        <Search size={16} />
      </IconButton>
    );
  }

  return (
    <button className={clsx(s.root, s[variant], className)} type='button' onClick={open}>
      <Search aria-hidden className={s.icon} size={variant === 'hero' ? 20 : 14} />
      <span className={s.label}>{variant === 'hero' ? t('heroPlaceholder') : t('trigger')}</span>
      <span className={s.keys}>
        <Kbd>{tCommon('kbd.ctrl')}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
};
