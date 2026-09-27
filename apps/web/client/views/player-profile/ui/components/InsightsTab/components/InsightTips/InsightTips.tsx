'use client';

import { TANK_CLASSES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { InsightTipsProps } from './InsightTips.types';

import { tipValues } from '../../../../../lib/insight-tip';

import s from './InsightTips.module.scss';

export const InsightTips = ({ insights }: InsightTipsProps) => {
  const t = useTranslations('profile.insights.tips');
  const tGame = useTranslations('game.classes');

  return (
    <ul className={s.root}>
      {insights.tips.map((tip) => {
        const type = TANK_CLASSES.find((value) => value === tip.params.type);

        return (
          <li key={`${tip.code}-${JSON.stringify(tip.params)}`} className={s.tip} data-code={tip.code}>
            <strong className={s.title}>{t(`${tip.code}.title`)}</strong>
            <p className={s.body}>
              {t(`${tip.code}.body`, { ...tipValues({ tip, insights }), type: type ? tGame(type) : String(tip.params.type ?? '') })}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
