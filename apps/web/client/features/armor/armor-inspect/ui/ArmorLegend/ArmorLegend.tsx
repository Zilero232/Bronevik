'use client';

import { useTranslations } from 'next-intl';

import { ARMOR_FACE_CLASSES, ARMOR_PALETTE } from '@/entities/armor/armor-model';

import { ARMOR_HEAT_LEGEND } from '../../config';
import { useArmorAttack } from '../../model/context';
import { HeatLegend } from './components';

import s from './ArmorLegend.module.scss';

export const ArmorLegend = () => {
  const t = useTranslations('armor.legend');
  const { heatmap } = useArmorAttack();

  const classes = heatmap ? ARMOR_HEAT_LEGEND.fixedClasses : ARMOR_FACE_CLASSES;

  return (
    <section aria-label={t('title')} className={s.root}>
      <h2 className={s.title}>{t('title')}</h2>
      {heatmap && <HeatLegend />}
      <ul className={s.list}>
        {classes.map((face) => (
          <li key={face} className={s.item} style={{ '--swatch': ARMOR_PALETTE[face] }}>
            <span aria-hidden className={s.swatch} />
            {t(face)}
          </li>
        ))}
      </ul>
      <p className={s.note}>{t('heNote')}</p>
    </section>
  );
};
