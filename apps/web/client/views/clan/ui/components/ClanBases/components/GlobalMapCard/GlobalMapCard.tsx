'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import type { GlobalMapCardProps } from './GlobalMapCard.types';

import { globalMapSummary } from '../../../../../lib/global-map';
import { BaseCard } from '../BaseCard';
import { BaseRow } from '../BaseRow';
import { BaseSection } from '../BaseSection';

export const GlobalMapCard = ({ globalMap }: GlobalMapCardProps) => {
  const t = useTranslations('clans.bases.globalMap');
  const format = useFormatter();

  const { elo, revenue } = globalMapSummary(globalMap);

  return (
    <BaseCard
      figures={
        <KeyFigures>
          <KeyFigure label={t('provincesLabel')} value={globalMap.provincesCount} />
          <KeyFigure label={t('dailyRevenue')} value={revenue} />
          {elo.map(({ tier, value }) => (
            <KeyFigure key={tier} label={t('elo', { tier })} value={value} />
          ))}
        </KeyFigures>
      }
      title={t('provinces', { count: globalMap.provincesCount })}
    >
      <BaseSection isEmpty={globalMap.provinces.length === 0} note={t('noProvinces')} title={t('provincesTitle')}>
        {globalMap.provinces.map(({ provinceId, name, dailyRevenue }) => (
          <BaseRow key={provinceId} label={name}>
            {dailyRevenue === null ? '—' : format.number(dailyRevenue)}
          </BaseRow>
        ))}
      </BaseSection>
    </BaseCard>
  );
};
