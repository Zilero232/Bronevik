import type { BattleClockWidgetProps } from './BattleClockWidget.types';

import { ClientIcon } from '../../../../shared/ui/hud';

import s from './BattleClockWidget.module.scss';

export const BattleClockWidget = ({ data }: BattleClockWidgetProps) => (
  <div className={s.clock}>
    {data.big_timer && data.timer && <span className={s.timer}>{data.timer}</span>}
    <div className={s.row}>
      <ClientIcon icon={data.icon} size={14} />
      <span className={s.time}>{data.time}</span>
      {data.date && <span className={s.muted}>{data.date}</span>}
      {!data.big_timer && data.timer && <span className={s.small}>{data.timer}</span>}
    </div>
  </div>
);
