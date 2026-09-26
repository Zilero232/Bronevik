'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { FavoriteButtonProps } from './FavoriteButton.types';

import { useFavoriteToggle } from '../model/hooks';

import s from './FavoriteButton.module.scss';

export const FavoriteButton = ({ kind, targetId, className }: FavoriteButtonProps) => {
  const t = useTranslations('me.favorites');
  const { isSignedIn, isFavorite, toggle } = useFavoriteToggle({ kind, targetId });

  if (!isSignedIn) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className })} href={ROUTES.auth.login}>
        <Star size={15} />
        {t('add')}
      </Link>
    );
  }

  return (
    <Button
      aria-pressed={isFavorite}
      className={className}
      disabled={toggle.isPending}
      size='sm'
      variant={isFavorite ? 'primary' : 'secondary'}
      onClick={() => toggle.mutate()}
    >
      <Star className={s.star} data-on={isFavorite} size={15} />
      {isFavorite ? t('inFavorites') : t('add')}
    </Button>
  );
};
