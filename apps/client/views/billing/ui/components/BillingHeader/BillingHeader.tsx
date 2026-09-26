import { useTranslations } from 'next-intl';

import s from './BillingHeader.module.scss';

export const BillingHeader = () => {
  const t = useTranslations('billing.header');

  return (
    <header className={s.root}>
      <h1 className={s.title}>{t('title')}</h1>
      <p className={s.description}>{t('description')}</p>
    </header>
  );
};
