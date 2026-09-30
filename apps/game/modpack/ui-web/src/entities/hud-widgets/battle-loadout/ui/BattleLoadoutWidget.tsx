import clsx from 'clsx';

import type { BattleLoadoutWidgetProps } from './BattleLoadoutWidget.types';

import { ClientIcon, Glyph, HudPlate } from '../../../../shared/ui/hud';
import { BATTLE_LOADOUT } from '../config';

import s from './BattleLoadoutWidget.module.scss';

export const BattleLoadoutWidget = ({ data }: BattleLoadoutWidgetProps) => (
  <HudPlate className={s.plate} rail='info'>
    <div className={s.row}>
      {data.groups.map((group, index) => (
        <div key={group.kind} className={clsx(s.group, index > 0 && s.divided, !data.compact && s.column)}>
          {group.items.map((item) => (
            <div key={item.name} className={s.item}>
              {item.icon && <ClientIcon icon={item.icon} size={data.size} />}
              {(!item.icon || !data.compact) && <span className={clsx(s.name, item.bonus && s.bonus)}>{item.name}</span>}
              {item.bonus && <Glyph className={s.star} name={BATTLE_LOADOUT.bonusGlyph} size={BATTLE_LOADOUT.bonusSize} tone='gold' />}
            </div>
          ))}
        </div>
      ))}
    </div>
  </HudPlate>
);
