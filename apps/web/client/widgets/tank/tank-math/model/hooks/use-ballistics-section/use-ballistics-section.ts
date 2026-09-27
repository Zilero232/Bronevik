'use client';

import { toShellKind } from '@otmetki/gamedata';
import { useFormatter, useTranslations } from 'next-intl';

import type { ChartSeries } from '@/ui-kit';

import type { UseBallisticsSectionInput } from './use-ballistics-section.types';

import { SHELL_TONES, TANK_MATH, TANK_MATH_FORMAT } from '../../../config';
import { ballisticsSeries, shellRows } from '../../../lib/ballistics-view';

export const useBallisticsSection = ({ config }: UseBallisticsSectionInput) => {
  const t = useTranslations('tankMath.ballistics');
  const format = useFormatter();

  const curves = ballisticsSeries(config.shells);
  const rows = shellRows(config.shells);
  const shellLabel = (shell: string): string => {
    const found = config.shells.find((item) => item.shell === shell);

    return found ? t(`kinds.${toShellKind(found.kind)}`) + (found.isPremium ? ` · ${t('premium')}` : '') : shell;
  };

  const toSeries = (items: { shell: string; values: number[] }[]): ChartSeries[] =>
    items.map(({ shell, values }, index) => ({ id: shell, label: shellLabel(shell), values, tone: SHELL_TONES[index % SHELL_TONES.length] }));

  return {
    labels: curves.distances.map((distance) => t('meters', { value: format.number(distance, TANK_MATH_FORMAT.meters) })),
    penetration: toSeries(curves.penetration),
    flightTime: toSeries(curves.flightTime),
    rows: rows.map((row) => ({ ...row, label: shellLabel(row.shell) })),
    distances: TANK_MATH.penetrationDistances,
    flightDistance: TANK_MATH.flightDistance,
    formatMillimeters: (value: number): string => t('millimeters', { value: format.number(value, TANK_MATH_FORMAT.meters) }),
    formatSeconds: (value: number): string => t('seconds', { value: format.number(value, TANK_MATH_FORMAT.seconds) })
  };
};
