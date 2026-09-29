import { useFormatter, useTranslations } from 'next-intl';

import { PROMO_MOCK } from '../../../../../config';

import s from './MockTeamHp.module.scss';

export const MockTeamHp = () => {
  const t = useTranslations('promo.mock.teamHp');
  const format = useFormatter();
  const { sides, score, tanks } = PROMO_MOCK.teamHp;

  return (
    <div className={s.root}>
      <div className={s.panel}>
        {sides.map(({ key, hp, share }) => (
          <div key={key} className={s.side} data-side={key}>
            <span className={s.label}>{t(key)}</span>
            <span className={s.bar}>
              <span className={s.fill} style={{ '--value': `${share}%` }} />
              <span className={s.hp}>{format.number(hp)}</span>
            </span>
          </div>
        ))}
        <div className={s.score}>
          <span data-side='allies'>{score.allies}</span>
          <span className={s.colon}>:</span>
          <span data-side='enemies'>{score.enemies}</span>
        </div>
      </div>
      <div className={s.tanks}>
        <ul className={s.row} data-side='allies'>
          {tanks.allies.map(({ id, hp }) => (
            <li key={id} className={s.tank} data-dead={hp === 0 || undefined} style={{ '--value': hp }} />
          ))}
        </ul>
        <ul className={s.row} data-side='enemies'>
          {tanks.enemies.map(({ id, hp }) => (
            <li key={id} className={s.tank} data-dead={hp === 0 || undefined} style={{ '--value': hp }} />
          ))}
        </ul>
      </div>
    </div>
  );
};
