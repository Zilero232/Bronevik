import clsx from 'clsx';

import type { BattleLoadoutWidgetProps } from './BattleLoadoutWidget.types';

import { ClientIcon, Glyph, HudPlate } from '../../../../shared/ui/hud';
import { BATTLE_LOADOUT } from '../config';
import { useHoveredItem } from '../model/hooks';
import { EquipmentTip, SetBadges } from './components';

import s from './BattleLoadoutWidget.module.scss';

export const BattleLoadoutWidget = ({ data }: BattleLoadoutWidgetProps) => {
  const { hovered, handlers } = useHoveredItem();
  const tip = hovered === null ? undefined : data.items[hovered];

  return (
    <div className={s.root}>
      {tip && <EquipmentTip item={tip} />}
      <HudPlate className={s.plate} rail='info'>
        <div className={s.row}>
          {data.sets.length > 0 && <SetBadges sets={data.sets} />}
          {data.items.map((item, index) => (
            <div
              key={item.name}
              className={clsx(s.item, item.bonus && s.bonus, item.boosted && s.boosted, item.active && s.active, item.used && s.used)}
              {...handlers(index)}
            >
              <ClientIcon icon={item.icon} size={data.size} />
              {item.overlay && <ClientIcon className={s.overlay} icon={item.overlay} size={data.size} />}
              {item.bonus && <Glyph className={s.star} name={BATTLE_LOADOUT.bonusGlyph} size={BATTLE_LOADOUT.bonusSize} tone='gold' />}
              {item.attention && <span className={s.attention}>{BATTLE_LOADOUT.attentionMark}</span>}
            </div>
          ))}
        </div>
      </HudPlate>
    </div>
  );
};
