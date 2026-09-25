'use client';

import { MOE, projectMoeBattles } from '@bronevik/ratings';
import { ArrowUpRight, Crosshair } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, Skeleton } from '@/ui-kit';

import type { MoeResultsProps } from '../../MoeCalculator.types';

import { MOE_TARGETS } from '../../../../../config';
import { useLatestMoe } from '../../../../../model/hooks';
import { ResultFigure } from '../../../CalcKit';

export const MoeResults = ({ vehicle, percent, damage, target }: MoeResultsProps) => {
  const t = useTranslations('tools.moe');
  const format = useFormatter();
  const { threshold, isFetching } = useLatestMoe(vehicle?.tankId ?? null);

  const marks = MOE_TARGETS.find(({ value }) => value === target)?.marks ?? 3;
  const targetPercent = MOE.markPercents[marks - 1] ?? MOE.maxPercent;
  const projection =
    threshold && damage > 0
      ? projectMoeBattles({
          currentPercent: percent,
          targetPercent,
          averageCombinedDamage: damage,
          thresholds: { oneMark: threshold.p65, twoMarks: threshold.p85, threeMarks: threshold.p95, hundredPercent: threshold.p100 ?? undefined }
        })
      : null;

  const link = (
    <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={`${ROUTES.marks}#projection`}>
      {t('openMarks')}
      <ArrowUpRight size={14} />
    </Link>
  );

  return match({ hasVehicle: vehicle !== null, isFetching, projection })
    .with({ hasVehicle: false }, () => (
      <EmptyState action={link} description={t('pickDescription')} icon={<Crosshair size={28} />} title={t('pickTitle')} />
    ))
    .with({ isFetching: true, projection: null }, () => <Skeleton height={120} width='100%' />)
    .with({ projection: P.nonNullable }, ({ projection: { battles, targetEma } }) => (
      <>
        <ResultFigure
          fallback={t('unreachable')}
          hint={t('hint', { damage: format.number(Math.ceil(targetEma)), percent: targetPercent })}
          label={t('battles')}
          tone={battles === null ? 'bad' : 'accent'}
          value={battles}
        />
        {link}
      </>
    ))
    .otherwise(() => <EmptyState action={link} description={t('noDataHint')} icon={<Crosshair size={28} />} title={t('noData')} />);
};
