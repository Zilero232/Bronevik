'use client';

import { AnimatedMarkOfExcellence } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { LOGIN_BENEFITS, LOGIN_SECTIONS } from '../../../config';

import s from './LoginBenefits.module.scss';

export const LoginBenefits = () => {
  const t = useTranslations('auth.benefits');

  return (
    <aside aria-labelledby={LOGIN_SECTIONS.benefits} className={s.root}>
      <span aria-hidden className={s.texture} />
      <span aria-hidden className={s.emblem}>
        <AnimatedMarkOfExcellence marks={3} />
      </span>
      <header className={s.head}>
        <span className={s.kicker}>{t('kicker')}</span>
        <h2 className={s.title} id={LOGIN_SECTIONS.benefits}>
          {t('title')}
        </h2>
        <p className={s.lead}>{t('lead')}</p>
      </header>
      <ul className={s.list}>
        {LOGIN_BENEFITS.map(({ key, icon: Icon, tone }) => (
          <li key={key} className={s.item} data-tone={tone}>
            <span aria-hidden className={s.icon}>
              <Icon size={20} />
            </span>
            <div className={s.body}>
              <h3 className={s.itemTitle}>{t(`items.${key}.title`)}</h3>
              <p className={s.itemText}>{t(`items.${key}.text`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
