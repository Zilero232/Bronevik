import { useFormatter, useTranslations } from 'next-intl';

import { ClassIcon } from '@/ui-kit';

import { PROMO_ICON, PROMO_MOCK } from '../../../../../config';
import { MockWindow } from '../MockWindow';

import s from './MockHits.module.scss';

export const MockHits = () => {
  const t = useTranslations('promo.mock.hits');
  const format = useFormatter();

  return (
    <MockWindow title={t('title')}>
      <ul className={s.entries}>
        {PROMO_MOCK.hits.entries.map(({ id, tankClass, outcome, damage }) => (
          <li key={id} className={s.entry} data-outcome={outcome}>
            <ClassIcon className={s.class} size={PROMO_ICON.mock} tankClass={tankClass} />
            <span className={s.outcome}>{t(`outcomes.${outcome}`)}</span>
            <span className={s.damage}>{format.number(damage)}</span>
          </li>
        ))}
      </ul>
      <p className={s.foot}>
        <span>{t('blocked')}</span>
        <span className={s.footValue}>{format.number(PROMO_MOCK.hits.blocked)}</span>
      </p>
    </MockWindow>
  );
};
