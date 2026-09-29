import { useFormatter, useTranslations } from 'next-intl';

import { ClassIcon } from '@/ui-kit';

import { PROMO_ICON, PROMO_MOCK } from '../../../../../config';
import { MockWindow } from '../MockWindow';

import s from './MockDamageLog.module.scss';

export const MockDamageLog = () => {
  const t = useTranslations('promo.mock.damageLog');
  const format = useFormatter();

  return (
    <MockWindow title={t('title')}>
      <ul className={s.totals}>
        {PROMO_MOCK.damageLog.totals.map(({ key, value }) => (
          <li key={key} className={s.total} data-kind={key}>
            <span className={s.totalValue}>{format.number(value)}</span>
            <span className={s.totalLabel}>{t(`totals.${key}`)}</span>
          </li>
        ))}
      </ul>
      <ul className={s.entries}>
        {PROMO_MOCK.damageLog.entries.map(({ id, shell: Shell, tankClass, damage }) => (
          <li key={id} className={s.entry}>
            <Shell className={s.shell} size={PROMO_ICON.mockSide} />
            <ClassIcon className={s.class} size={PROMO_ICON.mock} tankClass={tankClass} />
            <span className={s.bar} style={{ '--value': damage }} />
            <span className={s.damage}>{format.number(damage)}</span>
          </li>
        ))}
      </ul>
    </MockWindow>
  );
};
