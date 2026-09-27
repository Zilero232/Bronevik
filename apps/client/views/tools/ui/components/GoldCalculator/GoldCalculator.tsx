'use client';

import { useTranslations } from 'next-intl';

import { GOLD } from '../../../config';
import { useGoldCalculator } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { ResultFigure } from '../ResultFigure';
import { ResultList } from '../ResultList';
import { GoldBundles } from './components';

export const GoldCalculator = () => {
  const t = useTranslations('tools.gold');
  const { values, field, credits, creditsHint, conversions } = useGoldCalculator();

  return (
    <CalcShell
      inputs={
        <>
          <FieldGrid
            fields={[
              { key: 'gold', label: t('fields.gold'), ...GOLD.goldRange },
              { key: 'credits', label: t('fields.credits'), ...GOLD.creditsRange },
              { key: 'xp', label: t('fields.xp'), ...GOLD.xpRange }
            ]}
            field={field}
            values={values}
          />
          <GoldBundles />
        </>
      }
      results={
        <>
          <ResultFigure hint={creditsHint} label={t('goldToCredits')} value={credits} />
          <ResultList items={conversions} />
        </>
      }
      description={t('description')}
      footer={t('footer', { credits: GOLD.creditsPerGold, xp: GOLD.xpPerGold })}
      title={t('title')}
    />
  );
};
