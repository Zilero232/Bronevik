'use client';

import { useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { TankPicker } from '@/features/tank/pick-tank';
import { QueryState, Skeleton } from '@/ui-kit';

import type { SpottingSectionProps } from './SpottingSection.types';

import { TANK_MATH } from '../../../../config';
import { useSpottingSection } from '../../../../model/hooks';
import { MathSection } from '../MathSection';
import { SpottingResult, SpottingSideFields } from './components';

import s from './SpottingSection.module.scss';

export const SpottingSection = ({ data, preset }: SpottingSectionProps) => {
  const t = useTranslations('tankMath.spotting');
  const { form, vehicle, targetVehicle, onTargetChange, foliage, meters, percent, query } = useSpottingSection({ data, preset });

  return (
    <MathSection description={t('description')} title={t('title')}>
      <form className={s.sides} onSubmit={(event) => event.preventDefault()}>
        <SpottingSideFields control={form.control} foliage={foliage} side='me' title={t('me')}>
          {vehicle && <TankCell image='contour' vehicle={vehicle} />}
        </SpottingSideFields>
        <SpottingSideFields control={form.control} foliage={foliage} side='them' title={t('them')}>
          <TankPicker label={t('target')} placeholder={t('targetPlaceholder')} value={targetVehicle ?? vehicle} onChange={onTargetChange} />
        </SpottingSideFields>
      </form>
      <QueryState query={query} skeleton={<Skeleton height={TANK_MATH.chartHeight} shape='block' width='100%' />}>
        {({ view, tone }) => <SpottingResult meters={meters} percent={percent} tone={tone} view={view} />}
      </QueryState>
    </MathSection>
  );
};
