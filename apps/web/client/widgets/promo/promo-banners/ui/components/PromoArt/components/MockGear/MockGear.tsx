import { useFormatter, useTranslations } from 'next-intl';

import { PROMO_ICON, PROMO_MOCK } from '../../../../../config';

import s from './MockGear.module.scss';

export const MockGear = () => {
  const t = useTranslations('promo.mock.gear');
  const format = useFormatter();
  const { consumables, shells, reload } = PROMO_MOCK.gear;

  return (
    <div className={s.root}>
      <div className={s.reload}>
        <span className={s.reloadLabel}>{t('reload')}</span>
        <span className={s.reloadValue}>{t('seconds', { value: format.number(reload.seconds, { minimumFractionDigits: 1 }) })}</span>
        <span className={s.track}>
          <span className={s.fill} style={{ '--value': `${reload.progress}%` }} />
        </span>
      </div>
      <div className={s.slots}>
        <ul className={s.group}>
          {shells.map(({ key, icon: Icon, count }, index) => (
            <li key={key} className={s.slot} data-active={index === 0 || undefined}>
              <Icon className={s.icon} size={PROMO_ICON.mockSide} />
              <span className={s.count}>{format.number(count)}</span>
            </li>
          ))}
        </ul>
        <ul className={s.group}>
          {consumables.map(({ key, icon: Icon, cooldown }) => (
            <li key={key} className={s.slot} data-kind='consumable' data-ready={cooldown === 0 || undefined} style={{ '--cooldown': cooldown }}>
              <Icon className={s.icon} size={PROMO_ICON.mockSide} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
