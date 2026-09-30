import clsx from 'clsx';

import type { BattleLoadoutWidgetProps } from './BattleLoadoutWidget.types';

import { ClientIcon, Glyph, HudPlate } from '../../../../shared/ui/hud';
import { BATTLE_LOADOUT } from '../config';
import { useItemTooltip } from '../model/hooks';
import { EquipmentTip } from './components';

import s from './BattleLoadoutWidget.module.scss';

export const BattleLoadoutWidget = ({ data }: BattleLoadoutWidgetProps) => {
  const { tip, handlers } = useItemTooltip(data.items);

  return (
    <div className={s.root}>
      {tip && <EquipmentTip item={tip} />}
      <HudPlate className={s.plate} rail='info'>
        <div className={s.row}>
          {data.items.map((item, index) => (
            <div
              key={item.name}
              className={clsx(s.cell, item.bonus && s.bonus, item.boosted && s.boosted, item.active && s.active, item.used && s.used)}
              {...handlers(index)}
            >
              <ClientIcon icon={item.icon} size={data.size} tone='muted' />
              {item.overlay && <ClientIcon className={s.overlay} icon={item.overlay} size={data.size} />}
              {item.bonus && <Glyph className={s.star} name={BATTLE_LOADOUT.bonusGlyph} size={BATTLE_LOADOUT.bonusSize} tone='gold' />}
              {item.attention && (
                <Glyph className={s.attention} name={BATTLE_LOADOUT.attentionGlyph} size={BATTLE_LOADOUT.attentionSize} tone='warning' />
              )}
            </div>
          ))}
        </div>
      </HudPlate>
    </div>
  );
};
