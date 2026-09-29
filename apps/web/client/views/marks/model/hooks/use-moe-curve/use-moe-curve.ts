'use client';

import { useQuery } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { percentText } from '@/shared/lib';

import { moeCurveQuery } from '../../../api';
import { curveEntries, defaultCurvePercent } from '../../../lib/moe-curve';

export const useMoeCurve = (tankId: number) => {
  const t = useTranslations('marks.drawer.curve');
  const format = useFormatter();
  const query = useQuery({ ...moeCurveQuery(tankId), select: (curve) => ({ ...curve, entries: curveEntries(curve) }) });
  const [chosen, setChosen] = useState<number | null>(null);

  const entries = query.data?.entries ?? [];
  const percent = chosen ?? defaultCurvePercent(entries);
  const selected = entries.find((entry) => entry.percent === percent) ?? null;
  const hasModPoints = entries.some((entry) => entry.source === 'mod');

  return {
    query,
    items: entries.map((entry) => ({ value: String(entry.percent), label: percentText({ format, value: entry.percent, digits: 0 }) })),
    value: percent === null ? null : String(percent),
    rows: entries.map((entry) => ({
      percent: percentText({ format, value: entry.percent, digits: 0 }),
      damage: format.number(entry.damage),
      source: entry.source === 'threshold' ? t('sourceThreshold') : t('sourceMod', { players: entry.players ?? 0 }),
      isSelected: entry.percent === percent,
      key: entry.percent
    })),
    result: selected && {
      damage: format.number(selected.damage),
      note:
        selected.source === 'threshold'
          ? t('fromThreshold')
          : t('fromMod', { players: selected.players ?? 0, battles: selected.battles ?? 0, days: query.data?.windowDays ?? 0 })
    },
    note: hasModPoints
      ? t('modNote', { band: query.data?.bandPercent ?? 0, days: query.data?.windowDays ?? 0 })
      : t('onlyThresholds', { minPlayers: query.data?.minPlayers ?? 0, days: query.data?.windowDays ?? 0 }),
    onPercentChange: (value: string) => setChosen(Number(value))
  };
};
