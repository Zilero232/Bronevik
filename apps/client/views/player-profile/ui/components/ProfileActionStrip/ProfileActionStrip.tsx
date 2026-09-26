'use client';

import { BarChart3, Check, GitCompareArrows, PenLine, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FavoriteButton } from '@/features/player/toggle-favorite';
import { WatchButton } from '@/features/player/watch-player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import { useProfileActions } from '../../../model/hooks';

import s from './ProfileActionStrip.module.scss';

export const ProfileActionStrip = () => {
  const t = useTranslations('profile.actions');
  const { accountId, copied, share, signatureHref, analyticsHref } = useProfileActions();

  return (
    <div className={s.root} data-theme='dark'>
      <div aria-label={t('label')} className={s.inner} role='toolbar'>
        <div className={s.group}>
          <Link
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            href={{ pathname: ROUTES.players.compare, query: { ids: String(accountId) } }}
          >
            <GitCompareArrows aria-hidden size={16} />
            {t('compare')}
          </Link>
          <Button size='sm' variant='secondary' onClick={share}>
            {copied ? <Check aria-hidden size={16} /> : <Share2 aria-hidden size={16} />}
            {t('share')}
          </Button>
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={signatureHref}>
            <PenLine aria-hidden size={16} />
            {t('signature')}
          </Link>
          {analyticsHref && (
            <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={analyticsHref}>
              <BarChart3 aria-hidden size={16} />
              {t('myAnalytics')}
            </Link>
          )}
        </div>
        <div className={s.group}>
          <FavoriteButton kind='player' targetId={accountId} />
          <WatchButton accountId={accountId} />
        </div>
      </div>
    </div>
  );
};
