import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { MOD_FAIR_PLAY, MOD_PAGE } from '../../../config';
import { BanFigure } from './components';

import s from './ModFairPlay.module.scss';

export const ModFairPlay = () => {
  const t = useTranslations('mod.fairPlay');

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <div className={s.grid}>
        <div className={s.column} data-verdict='allowed'>
          <h3 className={s.heading}>{t('readsTitle')}</h3>
          <ul className={s.list}>
            {MOD_FAIR_PLAY.reads.map((key) => (
              <li key={key} className={s.item}>
                <Check aria-hidden className={s.mark} size={MOD_PAGE.iconSize} />
                {t(`reads.${key}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className={s.column} data-verdict='never'>
          <h3 className={s.heading}>{t('neverTitle')}</h3>
          <ul className={s.list}>
            {MOD_FAIR_PLAY.never.map((key) => (
              <li key={key} className={s.item}>
                <X aria-hidden className={s.mark} size={MOD_PAGE.iconSize} />
                {t(`never.${key}`)}
              </li>
            ))}
          </ul>
        </div>
        <BanFigure />
      </div>
    </section>
  );
};
