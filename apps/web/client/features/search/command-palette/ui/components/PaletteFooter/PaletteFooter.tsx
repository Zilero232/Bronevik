import { useTranslations } from 'next-intl';

import { Kbd } from '@/ui-kit';

import s from './PaletteFooter.module.scss';

export const PaletteFooter = () => {
  const t = useTranslations('search');

  return (
    <div className={s.root}>
      <span className={s.hint}>
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        {t('navigate')}
      </span>
      <span className={s.hint}>
        <Kbd>↵</Kbd>
        {t('open')}
      </span>
      <span className={s.brand}>{t('source')}</span>
    </div>
  );
};
