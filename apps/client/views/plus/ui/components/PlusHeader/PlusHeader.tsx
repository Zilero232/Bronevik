import { useTranslations } from 'next-intl';

import s from './PlusHeader.module.scss';

export const PlusHeader = () => {
  const t = useTranslations('plus.header');

  return (
    <header className={s.root}>
      <h1 className={s.title}>{t('title')}</h1>
      <p className={s.description}>{t('description')}</p>
    </header>
  );
};
