'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ErrorState, KeyFigure } from '@/ui-kit';

import { useServerStatus } from '../../../../../model/hooks';

import s from './HeroFigures.module.scss';

export const HeroFigures = () => {
  const t = useTranslations('home.hero');
  const status = useServerStatus();

  return (
    <aside aria-label={t('figures')} className={s.root}>
      {status.isError ? (
        <div className={s.error}>
          <ErrorState isCompact onRetry={status.retry} />
        </div>
      ) : (
        <>
          <KeyFigure
            className={s.figure}
            label={t('tracked')}
            size='lg'
            tone='accent'
            trend={status.activity.length > 0 ? status.activity : undefined}
            value={status.trackedPlayers}
          />
          {status.online === null ? (
            <KeyFigure className={s.figure} hint={t('estimateHint')} label={t('activeEstimate')} prefix='≈ ' value={status.activePlayers} />
          ) : (
            <KeyFigure className={s.figure} label={t('online')} value={status.online} />
          )}
          <KeyFigure className={s.figure} label={t('version')} value={status.version} />
        </>
      )}
      <Link className={s.more} href={ROUTES.pulse}>
        {t('pulse')}
      </Link>
    </aside>
  );
};
