'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { FOLIAGE_KINDS } from '@otmetki/gamedata';
import { useFormatter, useTranslations } from 'next-intl';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { UseSpottingSectionInput } from './use-spotting-section.types';

import { TANK_MATH_FORMAT, VERDICT_TONES } from '../../../config';
import { spottingView } from '../../../lib/spotting-view';
import { useSpottingForm } from '../use-spotting-form';
import { useTankMathData } from '../use-tank-math-data';

export const useSpottingSection = ({ data, preset }: UseSpottingSectionInput) => {
  const t = useTranslations('tankMath.spotting');
  const format = useFormatter();
  const { form, values } = useSpottingForm();
  const { data: catalog = [] } = useVehicleCatalog();
  const target = useTankMathData(values.targetId);

  const targetData = values.targetId === null ? data : target.data;
  const vehicle = catalog.find((item) => item.tankId === data.tankId) ?? null;
  const targetVehicle = values.targetId === null ? null : (catalog.find((item) => item.tankId === values.targetId) ?? null);

  const view = targetData
    ? spottingView({
        mine: { config: data[preset], camoSkillRate: data.camoSkillRate, values: values.me },
        theirs: { config: targetData[preset], camoSkillRate: targetData.camoSkillRate, values: values.them }
      })
    : null;

  const meters = (value: number): string => t('meters', { value: format.number(value, TANK_MATH_FORMAT.meters) });
  const percent = (value: number): string => format.number(value, TANK_MATH_FORMAT.percent);

  const onTargetChange = (picked: VehicleSummary | null) =>
    form.setValue('targetId', picked && picked.tankId !== data.tankId ? picked.tankId : null, { shouldValidate: true });

  return {
    form,
    vehicle,
    targetVehicle,
    onTargetChange,
    foliage: FOLIAGE_KINDS.map((value) => ({ value, label: t(`foliage.${value}`) })),
    meters,
    percent,
    query: {
      data: view ? { view, tone: VERDICT_TONES[view.duel.verdict] } : undefined,
      isError: values.targetId !== null && target.isError,
      isRefetching: target.isRefetching,
      refetch: target.refetch
    }
  };
};
