'use client';

import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import type { ModeSeasonProps } from './ModeSeason.types';

import { MODE_SEASON } from '../../config';
import { useModeSeason } from '../../model/hooks';

import s from './ModeSeason.module.scss';

export const ModeSeason = ({ season, className }: ModeSeasonProps) => {
  const t = useTranslations('modes.season');
  const format = useFormatter();
  const { phase, href, startsAt, endsAt } = useModeSeason(season);

  return (
    <p className={clsx(s.root, className)} data-phase={phase ?? undefined}>
      <span className={s.label}>{t(phase ?? 'current')}</span>
      {href ? (
        <a className={clsx(s.title, s.link)} href={href} rel='noreferrer' target='_blank'>
          {season.title}
        </a>
      ) : (
        <span className={s.title}>{season.title}</span>
      )}
      <span className={s.dates}>
        {endsAt
          ? format.dateTimeRange(startsAt, endsAt, MODE_SEASON.dateFormat)
          : t('since', { date: format.dateTime(startsAt, MODE_SEASON.dateFormat) })}
      </span>
    </p>
  );
};
