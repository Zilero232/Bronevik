'use client';

import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { ProfileMissingProps } from './ProfileMissing.types';

export const ProfileMissing = ({ nickname, reason }: ProfileMissingProps) => {
  const t = useTranslations('profile.missing');
  const queryClient = useQueryClient();

  const onRetry = () => queryClient.refetchQueries({ queryKey: ['player', 'profile'] });

  return (
    <EmptyState
      action={
        reason === 'error' ? (
          <Button variant='secondary' onClick={onRetry}>
            <RotateCcw size={16} />
            {t('retry')}
          </Button>
        ) : (
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.players}>
            <Search size={16} />
            {t('search')}
          </Link>
        )
      }
      code={reason === 'error' ? 'ERR' : '404'}
      description={t(`${reason}Description`, { nickname })}
      title={t(`${reason}Title`)}
    />
  );
};
