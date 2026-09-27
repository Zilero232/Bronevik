'use client';

import { Cpu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

import type { ModEmptyStateProps } from './ModEmptyState.types';

export const ModEmptyState = ({ title, description }: ModEmptyStateProps) => {
  const t = useTranslations('analytics.state');

  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
          {t('modAction')}
        </Link>
      }
      description={description ?? t('modText')}
      icon={<Cpu size={16} />}
      title={title ?? t('modTitle')}
    />
  );
};
