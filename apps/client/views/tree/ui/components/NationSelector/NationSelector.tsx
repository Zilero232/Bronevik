'use client';

import { NATION_ICONS, NATIONS } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { useTreeParams } from '../../../model/hooks';

import s from './NationSelector.module.scss';

export const NationSelector = () => {
  const t = useTranslations('game.nations');
  const tTree = useTranslations('tree.nations');
  const { nation, setNation } = useTreeParams();

  return (
    <div aria-label={tTree('label')} className={s.root} role='radiogroup'>
      {NATIONS.map((value) => {
        const Icon = NATION_ICONS[value];

        return (
          <button key={value} aria-checked={value === nation} className={s.chip} role='radio' type='button' onClick={() => setNation(value)}>
            <Icon aria-hidden className={s.icon} palette='color' size={16} />
            <span>{t(value)}</span>
          </button>
        );
      })}
    </div>
  );
};
