'use client';

import { AnimatedMarkOfExcellence } from '@bronevik/icons';
import { Ban, Crosshair, PartyPopper } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { AnimatedNumber, EmptyState, Skeleton } from '@/ui-kit';

import type { ProjectionResultProps } from '../../MoeProjection.types';

import { TARGET_MARKS } from '../../../../../config';

import s from './ProjectionResult.module.scss';

export const ProjectionResult = ({ battles, hasResult, hasVehicle, isLoading, marks, targetDamage }: ProjectionResultProps) => {
  const t = useTranslations('marks.projection');
  const format = useFormatter();

  const markCount = TARGET_MARKS.find(({ value }) => value === marks)?.marks ?? 3;
  const damageText = targetDamage === null ? '—' : format.number(Math.ceil(targetDamage));

  return match({ hasVehicle, isLoading, hasResult, battles })
    .with({ hasVehicle: false }, () => <EmptyState description={t('pickDescription')} icon={<Crosshair size={28} />} title={t('pickTitle')} />)
    .with({ isLoading: true }, () => <Skeleton height={120} width='100%' />)
    .with({ hasResult: false }, () => <EmptyState description={t('damageMissingHint')} icon={<Crosshair size={28} />} title={t('damageMissing')} />)
    .with({ battles: 0 }, () => <EmptyState description={t('doneHint')} icon={<PartyPopper size={28} />} title={t('done')} />)
    .with({ battles: P.nullish }, () => (
      <div className={s.root} data-state='unreachable'>
        <Ban aria-hidden className={s.ban} size={40} />
        <div className={s.copy}>
          <p className={s.headline}>{t('unreachable')}</p>
          <p className={s.hint}>{t('unreachableHint', { damage: damageText })}</p>
        </div>
      </div>
    ))
    .with({ battles: P.number }, ({ battles: count }) => (
      <div className={s.root}>
        <AnimatedMarkOfExcellence key={marks} className={s.mark} marks={markCount} size={64} strokeWidth={1.3} />
        <div className={s.copy}>
          <span className={s.label}>{t('battlesLabel')}</span>
          <AnimatedNumber className={s.value} duration={0.9} value={count} />
          <p className={s.hint}>{t('battlesHint', { count, damage: damageText })}</p>
        </div>
      </div>
    ))
    .exhaustive();
};
