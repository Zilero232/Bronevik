'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, RelativeTime, SegmentedControl } from '@/ui-kit';

import type { DigestSettingsProps } from './DigestSettings.types';

import { WATCHLIST_PAGE } from '../../../config';
import { useWatchlistDigest } from '../../../model/hooks';

import s from './DigestSettings.module.scss';

export const DigestSettings = ({ digest, lastDigestAt }: DigestSettingsProps) => {
  const t = useTranslations('watchlist.digest');
  const { value, options, isLockedPicked, onChange } = useWatchlistDigest({ digest });

  return (
    <Card className={s.root} padding='md'>
      <CardHeader meta={<RelativeTime fallback={t('never')} value={lastDigestAt} />} title={t('title')} />
      <p className={s.text}>{t('description')}</p>
      <SegmentedControl
        options={options.map((option) => ({
          value: option.value,
          label: t(`options.${option.value}`),
          icon: option.isLocked ? <Lock size={WATCHLIST_PAGE.iconSize} /> : undefined
        }))}
        aria-label={t('label')}
        size='sm'
        value={value}
        onChange={onChange}
      />
      {isLockedPicked && (
        <div className={s.locked} role='status'>
          <PlusBadge />
          <span>{t('hourlyPlus')}</span>
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.plus}>
            {t('plusLink')}
          </Link>
        </div>
      )}
      <p className={s.hint}>
        {t.rich('channels', {
          link: (chunks) => (
            <Link className={s.link} href={ROUTES.account.notifications}>
              {chunks}
            </Link>
          )
        })}
      </p>
    </Card>
  );
};
