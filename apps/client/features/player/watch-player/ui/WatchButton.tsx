'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { WatchButtonProps } from './WatchButton.types';

import { WATCH_BUTTON } from '../config';
import { useWatchToggle } from '../model/hooks';

export const WatchButton = ({ accountId, className }: WatchButtonProps) => {
  const t = useTranslations('watchlist.button');
  const { isSignedIn, isWatched, isPending, onToggle } = useWatchToggle(accountId);

  if (!isSignedIn) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className })} href={ROUTES.auth.login}>
        <Eye size={WATCH_BUTTON.iconSize} />
        {t('watch')}
      </Link>
    );
  }

  return (
    <Button aria-pressed={isWatched} className={className} disabled={isPending} size='sm' variant='secondary' onClick={onToggle}>
      {isWatched ? <EyeOff size={WATCH_BUTTON.iconSize} /> : <Eye size={WATCH_BUTTON.iconSize} />}
      {isWatched ? t('unwatch') : t('watch')}
    </Button>
  );
};
