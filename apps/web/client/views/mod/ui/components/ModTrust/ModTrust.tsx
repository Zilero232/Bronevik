import { useTranslations } from 'next-intl';

import { MOD_PAGE, MOD_TRUST } from '../../../config';

import s from './ModTrust.module.scss';

export const ModTrust = () => {
  const t = useTranslations('mod.trust');

  return (
    <section aria-label={t('label')}>
      <ul className={s.list}>
        {MOD_TRUST.map(({ id, icon: Icon, tone }) => (
          <li key={id} className={s.item} data-tone={tone}>
            <span aria-hidden className={s.icon}>
              <Icon size={MOD_PAGE.featureIconSize} />
            </span>
            <span className={s.body}>
              <span className={s.title}>{t(`items.${id}.title`)}</span>
              <span className={s.text}>{t(`items.${id}.text`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
