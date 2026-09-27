import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { MOD_FEATURES, MOD_PAGE } from '../../../config';

import s from './ModFeatures.module.scss';

export const ModFeatures = () => {
  const t = useTranslations('mod.features');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <ul className={s.grid}>
        {MOD_FEATURES.map(({ key, icon: Icon }) => (
          <li key={key} className={s.card}>
            <Icon aria-hidden className={s.icon} size={MOD_PAGE.featureIconSize} />
            <h3 className={s.title}>{t(`items.${key}.title`)}</h3>
            <p className={s.text}>{t(`items.${key}.text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
