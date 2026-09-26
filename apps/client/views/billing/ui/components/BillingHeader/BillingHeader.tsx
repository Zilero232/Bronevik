import { useTranslations } from 'next-intl';

import s from './BillingHeader.module.scss';

export const BillingHeader = () => {
  const t = useTranslations('billing.header');
  const tBrand = useTranslations('brand');

  return (
    <header className={s.root}>
      <h1 className={s.title}>{t('title')}</h1>
      <p className={s.description}>{t('description', { plus: tBrand('plus') })}</p>
    </header>
  );
};
