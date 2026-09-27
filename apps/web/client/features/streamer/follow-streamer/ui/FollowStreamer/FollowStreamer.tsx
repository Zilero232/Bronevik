'use client';

import { clsx } from 'clsx';
import { Bell, BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { FollowStreamerProps } from './FollowStreamer.types';

import { FOLLOW_STREAMER } from '../../config';
import { useFollowStreamer } from '../../model/hooks';

import s from './FollowStreamer.module.scss';

export const FollowStreamer = ({ slug, renderExtras, className }: FollowStreamerProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('streamersDirectory.follow');
  const { isSignedIn, state, isBusy, onToggle } = useFollowStreamer(slug);

  if (!isSignedIn) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className })} href={loginHref}>
        <Bell size={FOLLOW_STREAMER.iconSize} />
        {t('signIn')}
      </Link>
    );
  }

  return (
    <div className={clsx(s.root, className)}>
      <Button aria-pressed={state.isFollowing} disabled={isBusy} size='sm' variant={state.isFollowing ? 'secondary' : 'primary'} onClick={onToggle}>
        {state.isFollowing ? <BellOff size={FOLLOW_STREAMER.iconSize} /> : <Bell size={FOLLOW_STREAMER.iconSize} />}
        {state.isFollowing ? t('unfollow') : t('follow')}
      </Button>
      {renderExtras?.(state)}
    </div>
  );
};
