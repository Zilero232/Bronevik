import clsx from 'clsx';

import type { BattleLoadoutWidgetProps } from './BattleLoadoutWidget.types';

import { ClientIcon, HudPlate } from '../../../../shared/ui/hud';
import { BATTLE_LOADOUT } from '../config';

import s from './BattleLoadoutWidget.module.scss';

export const BattleLoadoutWidget = ({ data }: BattleLoadoutWidgetProps) => (
  <HudPlate className={s.plate}>
    <div className={s.row}>
      {data.groups.map((group, index) => (
        <div key={group.kind} className={clsx(s.group, index > 0 && s.divided, !data.compact && s.column)}>
          {group.items.map((item) => (
            <div key={item.name} className={s.item}>
              {item.icon && <ClientIcon icon={item.icon} size={data.size} />}
              {(!item.icon || !data.compact) && <span className={clsx(s.name, item.bonus && s.bonus)}>{item.name}</span>}
              {item.bonus && <span className={s.star}>{BATTLE_LOADOUT.bonusMark}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  </HudPlate>
);
