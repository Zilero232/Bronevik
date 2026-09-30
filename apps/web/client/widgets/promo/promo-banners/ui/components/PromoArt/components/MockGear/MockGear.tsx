import { useFormatter, useTranslations } from 'next-intl';

import { PROMO_ICON, PROMO_MOCK } from '../../../../../config';

import s from './MockGear.module.scss';

export const MockGear = () => {
  const t = useTranslations('promo.mock.gear');
  const format = useFormatter();
  const { equipment, reload } = PROMO_MOCK.gear;

  return (
    <div className={s.root}>
      <ul className={s.slots}>
        {equipment.map(({ key, icon: Icon, mark }) => (
          <li key={key} className={s.slot} data-mark={mark}>
            <Icon className={s.icon} size={PROMO_ICON.mockSide} />
          </li>
        ))}
      </ul>
      <div className={s.reload}>
        <span className={s.reloadLabel}>{t('reload')}</span>
        <span className={s.reloadValue}>{t('seconds', { value: format.number(reload.seconds, { minimumFractionDigits: 1 }) })}</span>
        <span className={s.track}>
          <span className={s.fill} style={{ '--value': `${reload.progress}%` }} />
        </span>
        <ul className={s.clip}>
          {reload.clip.map(({ id, isLoaded }) => (
            <li key={id} className={s.round} data-loaded={isLoaded || undefined} />
          ))}
        </ul>
      </div>
    </div>
  );
};
