'use client';

import { clsx } from 'clsx';
import { GitCompareArrows, ListChecks } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, IconButton } from '@/ui-kit';

import type { CompareToggleProps } from './CompareToggle.types';

import { COMPARE_SELECTION } from '../../config';
import { useCompareToggle } from '../../model/hooks';

import s from './CompareToggle.module.scss';

export const CompareToggle = ({ entry, variant = 'icon', className }: CompareToggleProps) => {
  const t = useTranslations('compareTray.toggle');
  const { isOn, isFull, label, onToggle } = useCompareToggle(entry);

  const Icon = isOn ? ListChecks : GitCompareArrows;

  if (variant === 'button') {
    return (
      <Button
        aria-pressed={isOn}
        className={className}
        data-on={isOn}
        disabled={isFull}
        size='sm'
        title={label}
        variant='secondary'
        onClick={onToggle}
      >
        <Icon aria-hidden size={COMPARE_SELECTION.iconSize} />
        {isOn ? t('buttonOn') : t('button')}
      </Button>
    );
  }

  return (
    <IconButton
      aria-label={label}
      aria-pressed={isOn}
      className={clsx(s.icon, className)}
      data-on={isOn}
      disabled={isFull}
      isActive={isOn}
      size='sm'
      title={label}
      onClick={onToggle}
    >
      <Icon aria-hidden size={COMPARE_SELECTION.iconSize - 2} />
    </IconButton>
  );
};
