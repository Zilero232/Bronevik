'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Card, CardHeader, DataSourceNote, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { TankMathProps } from './TankMath.types';

import { TANK_MATH } from '../config';
import { useTankMath } from '../model/hooks';
import { BallisticsSection } from './components/BallisticsSection';
import { HandlingSection } from './components/HandlingSection';
import { SpottingSection } from './components/SpottingSection';

import s from './TankMath.module.scss';

export const TankMath = ({ tankId, id, className }: TankMathProps) => {
  const t = useTranslations('tankMath');
  const { data, config, other, preset, presets, setPreset, isPending, isError, retry } = useTankMath(tankId);

  return (
    <Card className={clsx(s.root, className)} id={id} padding='none'>
      <CardHeader
        action={<SegmentedControl aria-label={t('presets.label')} options={presets} size='sm' value={preset} onChange={setPreset} />}
        className={s.header}
        meta={config ? t('modules', { gun: config.modules.gun, turret: config.modules.turret }) : undefined}
        title={t('title')}
      />
      {match({ data, config, isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={TANK_MATH.skeletonHeight} shape='block' width='100%' />)
        .with({ data: P.nonNullable, config: P.nonNullable }, ({ data: loaded, config: current }) => (
          <div className={s.body}>
            <HandlingSection config={current} other={other} otherLabel={t(`presets.vs.${preset}`)} />
            <BallisticsSection config={current} />
            <SpottingSection data={loaded} preset={preset} />
            <p className={s.note}>{t('note')}</p>
            <DataSourceNote />
          </div>
        ))
        .with({ isError: true }, () => <ErrorState onRetry={retry} />)
        .otherwise(() => null)}
    </Card>
  );
};
