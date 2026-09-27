'use client';

import { useTranslations } from 'next-intl';

import { Badge, KeyFigure, StatList } from '@/ui-kit';

import type { SpottingResultProps } from './SpottingResult.types';

import s from './SpottingResult.module.scss';

export const SpottingResult = ({ view, tone, meters, percent }: SpottingResultProps) => {
  const t = useTranslations('tankMath.spotting');
  const { duel, mine, theirs } = view;

  return (
    <div aria-live='polite' className={s.root}>
      <div className={s.verdict}>
        <Badge tone={tone}>{t(`verdict.${duel.verdict}`)}</Badge>
        <span className={s.margin}>{t('margin', { value: meters(Math.abs(duel.margin)) })}</span>
      </div>
      <div className={s.figures}>
        <KeyFigure isFramed delta={duel.margin} deltaLabel={t('vsThem')} hint={t('iSpotHint')} label={t('iSpot')} value={meters(duel.iSpotAt)} />
        <KeyFigure
          isDeltaLowerBetter
          isFramed
          delta={-duel.margin}
          deltaLabel={t('vsMe')}
          hint={t('theySpotHint')}
          label={t('theySpot')}
          value={meters(duel.theySpotAt)}
        />
      </div>
      <StatList
        items={[
          { id: 'myView', label: t('rows.myView'), value: meters(mine.viewRange), delta: mine.viewRange - theirs.viewRange },
          { id: 'theirView', label: t('rows.theirView'), value: meters(theirs.viewRange) },
          { id: 'myCamo', label: t('rows.myCamo'), value: percent(mine.camouflage), delta: (mine.camouflage - theirs.camouflage) * 100 },
          { id: 'theirCamo', label: t('rows.theirCamo'), value: percent(theirs.camouflage) }
        ]}
      />
      <p className={s.limits}>{t('limits')}</p>
    </div>
  );
};
