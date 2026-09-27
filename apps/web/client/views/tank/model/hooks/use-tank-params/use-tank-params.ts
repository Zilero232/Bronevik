'use client';

import { useTranslations } from 'next-intl';

import { specsOfStats, TANK_SPEC_GROUPS, TANK_SPEC_KEYS, TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';

import type { ParamRow, ParamRowInput, ParamTab } from './use-tank-params.types';

import { PARAM_CONFIGS, PARAM_KEYS } from '../../../config';
import { paramShares } from '../../../lib';
import { useTank } from '../../context';

export const useTankParams = () => {
  const t = useTranslations('tank');
  const spec = useSpecFormat();
  const { detail } = useTank();

  const configs = PARAM_CONFIGS.flatMap((config) => {
    const stats = detail.stats[config];

    return stats ? [{ config, specs: specsOfStats(stats) }] : [];
  });

  const toRow = ({ key, value, share }: ParamRowInput): ParamRow => ({
    key,
    label: spec.label(key),
    value: spec.value({ key, value }),
    unit: spec.unit(key),
    share
  });

  const byConfig: ParamTab[] = configs.map(({ config, specs }, index) => ({
    value: config,
    label: t(`params.configs.${config}`),
    rows: PARAM_KEYS.map((key) =>
      toRow({ key, value: specs[key], share: paramShares({ key, values: configs.map((other) => other.specs[key]) })[index] ?? null })
    )
  }));

  const single = configs.at(0)?.specs ?? {};

  const byGroup: ParamTab[] = TANK_SPEC_GROUPS.map((group) => ({
    value: group,
    label: t(`specGroups.${group}`),
    rows: TANK_SPEC_KEYS.filter((key) => TANK_SPECS[key].group === group && single[key] !== null && single[key] !== undefined).map((key) =>
      toRow({ key, value: single[key], share: null })
    )
  })).filter(({ rows }) => rows.length > 0);

  const tabs = configs.length > 1 ? byConfig : byGroup;

  return { tabs };
};
