'use client';

import { useTranslations } from 'next-intl';

import { ARMOR_FACE_CLASSES, ARMOR_PALETTE } from '@/entities/armor/armor-model';

import s from './ArmorLegend.module.scss';

export const ArmorLegend = () => {
  const t = useTranslations('armor.legend');

  return (
    <section aria-label={t('title')} className={s.root}>
      <h2 className={s.title}>{t('title')}</h2>
      <ul className={s.list}>
        {ARMOR_FACE_CLASSES.map((face) => (
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
