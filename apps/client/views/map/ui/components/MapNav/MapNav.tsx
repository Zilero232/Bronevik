'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { MapNavProps } from './MapNav.types';

import { useMapNeighbours } from '../../../model/hooks';

import s from './MapNav.module.scss';

export const MapNav = ({ arenaId }: MapNavProps) => {
  const t = useTranslations('maps.map.nav');
  const { prev, next } = useMapNeighbours(arenaId);

  return (
    <nav aria-label={t('label')} className={s.root}>
      {prev && (
        <Link className={s.link} data-side='prev' href={ROUTES.map(prev.slug)}>
          <ArrowLeft aria-hidden className={s.arrow} size={16} />
          <span className={s.text}>
            <span className={s.hint}>{t('prev')}</span>
            <span className={s.name}>{prev.name}</span>
          </span>
        </Link>
      )}
      {next && (
        <Link className={s.link} data-side='next' href={ROUTES.map(next.slug)}>
          <span className={s.text}>
            <span className={s.hint}>{t('next')}</span>
            <span className={s.name}>{next.name}</span>
          </span>
          <ArrowRight aria-hidden className={s.arrow} size={16} />
        </Link>
      )}
    </nav>
  );
};
