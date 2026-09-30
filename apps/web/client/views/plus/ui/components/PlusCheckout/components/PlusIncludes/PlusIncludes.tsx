import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PLUS_BENEFITS } from '../../../../../config';

import s from './PlusIncludes.module.scss';

export const PlusIncludes = () => {
  const t = useTranslations('plus');

  return (
    <aside aria-labelledby='plus-includes-title' className={s.root}>
      <h3 className={s.title} id='plus-includes-title'>
        {t('checkout.includes.title')}
      </h3>
      <ul className={s.list}>
        {PLUS_BENEFITS.featured.map(({ id, icon: Icon }) => (
          <li key={id} className={s.item}>
            <Icon aria-hidden className={s.icon} size={18} strokeWidth={1.75} />
            <span className={s.label}>{t(`benefits.items.${id}.title`)}</span>
            <Check aria-hidden className={s.check} size={16} strokeWidth={2.5} />
          </li>
        ))}
      </ul>
      <p className={s.note}>{t('checkout.includes.free')}</p>
    </aside>
  );
};
