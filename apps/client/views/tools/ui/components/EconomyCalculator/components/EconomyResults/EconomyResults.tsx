'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { BarChart } from '@/ui-kit';

import type { EconomyResultsProps } from '../../EconomyCalculator.types';

import { TOOLS_FORMAT, TOOLS_LAYOUT } from '../../../../../config';
import { battleEconomy } from '../../../../../lib/battle-economy';
import { ResultFigure } from '../../../ResultFigure';

import s from './EconomyResults.module.scss';

export const EconomyResults = ({ values }: EconomyResultsProps) => {
  const t = useTranslations('tools.economy');
  const format = useFormatter();

  const economy = battleEconomy({
    tier: values.tier,
    isPremiumVehicle: values.isPremiumVehicle,
    damage: values.damage ?? 0,
    spotting: values.spotting ?? 0,
    shells: { ap: values.ap ?? 0, heat: values.heat ?? 0, he: values.he ?? 0 },
    prices: { ap: values.apPrice ?? 0, heat: values.heatPrice ?? 0, he: values.hePrice ?? 0 },
    consumables: { standard: values.standard ?? 0, premium: values.premium ?? 0 }
  });

  const { gross, grossPremium, repair, ammo, consumables, net, netPremium } = economy;

  return (
    <>
      <div className={s.figures}>
        <ResultFigure format={TOOLS_FORMAT.signed} label={t('net')} size='md' tone={net < 0 ? 'bad' : 'good'} value={net} />
        <ResultFigure format={TOOLS_FORMAT.signed} label={t('netPremium')} size='md' tone={netPremium < 0 ? 'bad' : 'good'} value={netPremium} />
      </div>
      <BarChart
        series={[
          { id: 'base', label: t('series.base'), values: [gross, repair, ammo, consumables, net], tone: 'steel' },
          { id: 'premium', label: t('series.premium'), values: [grossPremium, repair, ammo, consumables, netPremium], tone: 'accent' }
        ]}
        ariaLabel={t('chartAria')}
        formatValue={(value) => format.number(value)}
        height={TOOLS_LAYOUT.chartHeight}
        labels={[t('rows.gross'), t('rows.repair'), t('rows.ammo'), t('rows.consumables'), t('rows.net')]}
      />
    </>
  );
};
