'use client';

import { Heart } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { GuideLikeButtonProps } from './GuideLikeButton.types';

import { useGuideLike } from '../../../../../model/hooks';

import s from './GuideLikeButton.module.scss';

export const GuideLikeButton = ({ guide }: GuideLikeButtonProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('guides.detail');
  const format = useFormatter();
  const { isSignedIn, isLiked, likesCount, isAvailable, isPending, toggle } = useGuideLike(guide);

  if (!isSignedIn) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={loginHref} title={t('likeSignIn')}>
        <Heart size={14} />
        {format.number(likesCount)}
      </Link>
    );
  }

  return (
    <Button
      aria-label={isLiked ? t('unlike') : t('like')}
      aria-pressed={isLiked}
      disabled={!isAvailable || isPending}
      size='sm'
      title={isAvailable ? undefined : t('likeUnavailable')}
      variant={isLiked ? 'primary' : 'secondary'}
      onClick={toggle}
    >
      <Heart className={s.heart} data-on={isLiked} size={14} />
      {format.number(likesCount)}
    </Button>
  );
};
