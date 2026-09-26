'use client';

import { useTranslations } from 'next-intl';

import { FavoriteButton } from '@/features/player/toggle-favorite';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { HeaderActionsProps } from './HeaderActions.types';

import s from './HeaderActions.module.scss';

export const HeaderActions = ({ accountId }: HeaderActionsProps) => {
  const t = useTranslations('profile.header');

  return (
    <div className={s.root}>
      <Link
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        href={{ pathname: ROUTES.comparePlayers, query: { ids: String(accountId) } }}
      >
        {t('compare')}
      </Link>
      <FavoriteButton kind='player' targetId={accountId} />
    </div>
  );
};
