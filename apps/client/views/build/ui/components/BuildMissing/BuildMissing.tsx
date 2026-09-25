'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { BuildMissingProps } from './BuildMissing.types';

export const BuildMissing = ({ slug, reason }: BuildMissingProps) => {
  const t = useTranslations('builds.missing');
  const queryClient = useQueryClient();

  const onRetry = () => queryClient.refetchQueries({ type: 'active' });

  return (
    <EmptyState
      action={
        reason === 'error' ? (
          <Button variant='secondary' onClick={onRetry}>
            <RotateCcw size={16} />
            {t('retry')}
          </Button>
        ) : (
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.tanks}>
            <ArrowLeft size={16} />
            {t('back')}
          </Link>
        )
      }
      code={reason === 'error' ? 'ERR' : '404'}
      description={t(`${reason}Description`, { slug })}
      title={t(`${reason}Title`)}
    />
  );
};
