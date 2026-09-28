import { useTranslations } from 'next-intl';

import s from './DemoBanner.module.scss';

export const DemoBanner = () => {
  const t = useTranslations('common.demo');

  return (
    <p className={s.root} role='note'>
      <strong>{t('title')}</strong> {t('description')}
    </p>
  );
};
