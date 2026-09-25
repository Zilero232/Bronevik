'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { GoldValues } from './GoldCalculator.types';

import { GOLD } from '../../../config';
import { creditsToGold, freeXpToGold, goldToCredits, goldToFreeXp } from '../../../lib/gold-conversion';
import { useCalcState } from '../../../model/hooks';
import { CalcShell, FieldGrid, ResultFigure, ResultList } from '../CalcKit';
import { GoldBundles } from './components';

export const GoldCalculator = () => {
  const t = useTranslations('tools.gold');
  const format = useFormatter();
  const { values, field } = useCalcState<GoldValues>({ ...GOLD.defaults });

  const gold = values.gold ?? 0;
  const credits = values.credits ?? 0;
  const xp = values.xp ?? 0;

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
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
          <GoldBundles />
        </>
      }
      results={
        <>
          <ResultFigure hint={t('goldToCreditsHint', { gold: format.number(gold) })} label={t('goldToCredits')} value={goldToCredits(gold)} />
          <ResultList
            items={[
              { key: 'goldToXp', label: t('goldToXp'), value: format.number(goldToFreeXp(gold)), tone: 'accent' },
              { key: 'creditsToGold', label: t('creditsToGold', { credits: format.number(credits) }), value: format.number(creditsToGold(credits)) },
              { key: 'xpToGold', label: t('xpToGold', { xp: format.number(xp) }), value: format.number(freeXpToGold(xp)) }
            ]}
          />
        </>
      }
      description={t('description')}
      footer={t('footer', { credits: GOLD.creditsPerGold, xp: GOLD.xpPerGold })}
      title={t('title')}
    />
  );
};
