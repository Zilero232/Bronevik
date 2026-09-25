'use client';

import { NATION_ICONS, NATIONS } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SPRING } from '@/shared/lib';

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
        const isActive = value === nation;

        return (
          <button
            key={value}
            aria-checked={isActive}
            className={s.chip}
            data-active={isActive}
            role='radio'
            type='button'
            onClick={() => setNation(value)}
          >
            {isActive && <motion.span className={s.glow} layoutId='tree-nation' transition={SPRING} />}
            <Icon aria-hidden className={s.icon} palette='color' size={22} />
            <span className={s.label}>{t(value)}</span>
          </button>
        );
      })}
    </div>
  );
};
