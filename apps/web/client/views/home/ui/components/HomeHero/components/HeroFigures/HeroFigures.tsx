'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ErrorState, KeyFigure, RelativeTime } from '@/ui-kit';

import { HOME_FIGURES, HOME_ICON } from '../../../../../config';
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
            icon={<HOME_FIGURES.tracked.icon size={HOME_ICON.figure} />}
            label={t('tracked')}
            tone={HOME_FIGURES.tracked.tone}
            trend={status.activity.length > 0 ? status.activity : undefined}
            value={status.trackedPlayers}
            variant='tile'
          />
          {status.online === null ? (
            <KeyFigure
              className={s.figure}
              hint={t('estimateHint')}
              icon={<HOME_FIGURES.online.icon size={HOME_ICON.figure} />}
              label={t('activeEstimate')}
              prefix='≈ '
              tone={HOME_FIGURES.online.tone}
              value={status.activePlayers}
              variant='tile'
            />
          ) : (
            <KeyFigure
              className={s.figure}
              icon={<HOME_FIGURES.online.icon size={HOME_ICON.figure} />}
              label={t('online')}
              tone={HOME_FIGURES.online.tone}
              trend={status.activity.length > 0 ? status.activity : undefined}
              value={status.online}
              variant='tile'
            />
          )}
          <KeyFigure
            className={s.figure}
            hint={status.releasedAt ? <RelativeTime value={status.releasedAt} /> : undefined}
            icon={<HOME_FIGURES.version.icon size={HOME_ICON.figure} />}
            label={t('version')}
            tone={HOME_FIGURES.version.tone}
            value={status.version}
            variant='tile'
          />
        </>
      )}
      <Link className={s.more} href={ROUTES.pulse}>
        {t('pulse')}
      </Link>
    </aside>
  );
};
