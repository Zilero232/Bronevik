'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { useArmorAttack, useArmorInspect } from '@/features/armor/armor-inspect';

import type { UseArmorZonesInput, ZoneRow } from './use-armor-zones.types';

import { NO_SHELL } from '../../../config';
import { sceneParts } from '../../../lib/scene-parts';
import { zoneHits, zoneReports } from '../../../lib/zone-armor';

export const useArmorZones = ({ geometry }: UseArmorZonesInput) => {
  const t = useTranslations('armor');
  const format = useFormatter();
  const { modules, turret, gun } = useArmorInspect();
  const { layers, shellState } = useArmorAttack();
  const zones = zoneHits({ parts: sceneParts({ geometry, modules, turret, gun, layers }) });
  const reports = zoneReports({ zones, ...(shellState ?? NO_SHELL), hideSpaced: !layers.includes('spaced') });

  const rows = reports.map(({ layer, side, report }): ZoneRow => {
    const zone = t('zones.zone', { piece: t(`layers.${layer}`), side: t(`presets.${side}`) });

    if (!report) {
      return { key: `${layer}.${side}`, zone, verdict: null, nominal: null, angle: null, effective: null, chance: null };
    }

    return {
      key: `${layer}.${side}`,
      zone,
      verdict: report.verdict,
      nominal: t('hit.mm', { value: report.first.thickness }),
      angle: t('hit.degrees', { value: Math.round(report.first.angle) }),
      effective: t('hit.mm', { value: Math.round(report.total) }),
      chance: shellState ? format.number(report.chance, { style: 'percent', maximumFractionDigits: 0 }) : null
    };
  });

  return { rows, hasShell: shellState !== undefined };
};
