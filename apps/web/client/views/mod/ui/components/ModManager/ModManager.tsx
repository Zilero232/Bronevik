import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { MOD_MANAGER_FEATURES, MOD_PAGE } from '../../../config';

import s from './ModManager.module.scss';

export const ModManager = () => {
  const t = useTranslations('mod.managerApp');

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <ul className={s.grid}>
        {MOD_MANAGER_FEATURES.map(({ id, icon: Icon }) => (
          <li key={id} className={s.item}>
            <Icon aria-hidden className={s.icon} size={MOD_PAGE.featureIconSize} />
            <h3 className={s.title}>{t(`items.${id}.title`)}</h3>
            <p className={s.text}>{t(`items.${id}.text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
