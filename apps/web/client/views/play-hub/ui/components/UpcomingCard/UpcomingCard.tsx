import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './UpcomingCard.module.scss';

export const UpcomingCard = () => {
  const t = useTranslations('play.hub.upcoming');

  return (
    <aside className={s.root}>
      <span aria-hidden className={s.icon}>
        <Plus size={20} />
      </span>
      <span className={s.text}>
        <span className={s.title}>{t('title')}</span>
        <span className={s.description}>{t('description')}</span>
      </span>
    </aside>
  );
};
