import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './DataNotice.module.scss';

export const DataNotice = () => {
  const t = useTranslations('common.dataNotice');

  return (
    <aside className={s.root} role='note'>
      <p className={s.body}>
        <Info aria-hidden className={s.icon} size={16} />
        <span>
          <strong className={s.title}>{t('title')}</strong> {t('description')}
        </span>
      </p>
    </aside>
  );
};
