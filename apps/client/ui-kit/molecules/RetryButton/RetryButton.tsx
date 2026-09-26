'use client';

import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { RetryButtonProps } from './RetryButton.types';

import { Button } from '../../atoms';

export const RetryButton = ({ variant = 'secondary', size = 'sm', ...props }: RetryButtonProps) => {
  const t = useTranslations('common');

  return (
    <Button size={size} variant={variant} {...props}>
      <RotateCw aria-hidden />
      {t('retry')}
    </Button>
  );
};
