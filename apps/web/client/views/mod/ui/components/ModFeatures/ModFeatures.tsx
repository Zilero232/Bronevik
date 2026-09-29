import { useTranslations } from 'next-intl';

import { ROUTE_ANCHORS } from '@/shared/constants';
import { SectionHeader } from '@/ui-kit';

import { MOD_FEATURES, MOD_PAGE } from '../../../config';

import s from './ModFeatures.module.scss';

export const ModFeatures = () => {
  const t = useTranslations('mod.features');

  return (
    <section className={s.root} id={ROUTE_ANCHORS.modFeatures}>
      <SectionHeader title={t('title')} variant='display' />
      <ul className={s.grid}>
        {MOD_FEATURES.map(({ key, icon: Icon, tone }) => (
          <li key={key} className={s.card} data-tone={tone}>
            <span aria-hidden className={s.icon}>
              <Icon size={MOD_PAGE.featureIconSize} />
            </span>
            <h3 className={s.title}>{t(`items.${key}.title`)}</h3>
            <p className={s.text}>{t(`items.${key}.text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
